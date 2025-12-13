import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus, PaymentStatus as OrderPaymentStatus } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { EmailSenderService } from '../email-sender/email-sender.service';
import { paymentSuccessful, refundProcessed } from '../helpers/messages';


@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly emailService: EmailSenderService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2025-11-17.clover',
        });
    }

    async createPaymentIntent(data: CreatePaymentIntentDto, userId: string) {
        // Find order and verify ownership
        const order = await this.orderRepository.findOne({
            where: { id: data.orderId },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException({ status: 'error', message: 'Order not found' });
        }

        if (order.user.id !== userId) {
            throw new UnauthorizedException({ status: 'error', message: 'Unauthorized access to order' });
        }

        // Check if order already has a payment intent
        if (order.paymentIntentId) {
            const existingPayment = await this.paymentRepository.findOne({
                where: { paymentIntentId: order.paymentIntentId },
            });

            if (existingPayment && existingPayment.status === PaymentStatus.SUCCEEDED) {
                throw new BadRequestException({ status: 'error', message: 'Order already paid' });
            }
        }

        // Create Stripe Payment Intent
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(Number(order.total) * 100), // Convert to cents
            currency: process.env.STRIPE_CURRENCY || 'usd',
            metadata: {
                orderId: order.id,
                userId: userId,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Save payment record
        const payment = this.paymentRepository.create({
            amount: order.total,
            currency: process.env.STRIPE_CURRENCY || 'usd',
            status: PaymentStatus.PENDING,
            paymentIntentId: paymentIntent.id,
            paymentMethod: 'card',
            order: { id: order.id },
            user: { id: userId },
            metadata: {
                orderId: order.id,
            },
        });

        await this.paymentRepository.save(payment);

        // Update order with payment intent ID
        await this.orderRepository.update(
            { id: order.id },
            {
                paymentIntentId: paymentIntent.id,
                paymentStatus: OrderPaymentStatus.PROCESSING,
            }
        );

        return {
            status: 'success',
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            },
        };
    }

    async confirmPayment(data: ConfirmPaymentDto, userId: string) {
        // Find payment by intent ID
        const payment = await this.paymentRepository.findOne({
            where: { paymentIntentId: data.paymentIntentId },
            relations: ['order', 'user'],
        });

        if (!payment) {
            throw new NotFoundException({ status: 'error', message: 'Payment not found' });
        }

        if (payment.user.id !== userId) {
            throw new UnauthorizedException({ status: 'error', message: 'Unauthorized' });
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await this.stripe.paymentIntents.retrieve(data.paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            await this.handleSuccessfulPayment(payment.order.id, data.paymentIntentId);
            return { status: 'success', message: 'Payment confirmed successfully' };
        } else if (paymentIntent.status === 'requires_payment_method') {
            throw new BadRequestException({ status: 'error', message: 'Payment failed, please try again' });
        } else {
            return { status: 'processing', message: 'Payment is being processed' };
        }
    }



    private async handleSuccessfulPayment(orderId: string, paymentIntentId: string) {
        // Update payment status
        await this.paymentRepository.update(
            { paymentIntentId },
            { status: PaymentStatus.SUCCEEDED }
        );

        // Get order with cart items
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });

        if (!order) return;

        // Update order status
        await this.orderRepository.update(
            { id: orderId },
            {
                status: OrderStatus.PAID,
                paymentStatus: OrderPaymentStatus.SUCCEEDED,
                transactionId: paymentIntentId,
                paymentMethod: 'card',
            }
        );

        // Send confirmation email
        const user = await this.userRepository.findOne({ where: { id: order.user.id } });
        if (user) {
            await this.emailService.sendEmail(
                user.email,
                'Payment Successful',
                paymentSuccessful(user.fullname, orderId, Number(order.total))
            );
        }
    }



    async refundPayment(orderId: string, data: RefundPaymentDto) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException({ status: 'error', message: 'Order not found' });
        }

        if (!order.paymentIntentId) {
            throw new BadRequestException({ status: 'error', message: 'No payment to refund' });
        }

        const payment = await this.paymentRepository.findOne({
            where: { paymentIntentId: order.paymentIntentId },
        });

        if (!payment || payment.status !== PaymentStatus.SUCCEEDED) {
            throw new BadRequestException({ status: 'error', message: 'Payment not eligible for refund' });
        }

        // Create refund in Stripe
        const refundAmount = data.amount
            ? Math.round(data.amount * 100)
            : Math.round(Number(order.total) * 100);

        const refund = await this.stripe.refunds.create({
            payment_intent: order.paymentIntentId,
            amount: refundAmount,
            reason: 'requested_by_customer',
            metadata: {
                orderId: order.id,
                reason: data.reason || 'Admin refund',
            },
        });

        // Update payment status
        await this.paymentRepository.update(
            { paymentIntentId: order.paymentIntentId },
            { status: PaymentStatus.REFUNDED }
        );

        // Update order status
        await this.orderRepository.update(
            { id: orderId },
            { paymentStatus: OrderPaymentStatus.REFUNDED }
        );

        // Send refund email
        await this.emailService.sendEmail(
            order.user.email,
            'Refund Processed',
            refundProcessed(order.user.fullname, orderId, refundAmount / 100)
        );

        return {
            status: 'success',
            message: 'Refund processed successfully',
            data: { refundId: refund.id },
        };
    }

    async getPaymentStatus(orderId: string, userId: string) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException({ status: 'error', message: 'Order not found' });
        }

        if (order.user.id !== userId) {
            throw new UnauthorizedException({ status: 'error', message: 'Unauthorized' });
        }

        const payment = await this.paymentRepository.findOne({
            where: { order: { id: orderId } },
        });

        return {
            status: 'success',
            data: {
                orderId: order.id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.status,
                paymentIntentId: order.paymentIntentId,
                amount: order.total,
                payment: payment || null,
            },
        };
    }
}
