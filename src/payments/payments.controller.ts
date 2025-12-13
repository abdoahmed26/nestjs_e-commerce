/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import type { Request } from 'express';

@Controller('api/v1/payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('create-intent')
    @UseGuards(AuthGuard)
    createPaymentIntent(@Body() data: CreatePaymentIntentDto, @Req() req: Request) {
        const userId = (req as any).user.id;
        return this.paymentsService.createPaymentIntent(data, userId);
    }

    @Post('confirm')
    @UseGuards(AuthGuard)
    confirmPayment(@Body() data: ConfirmPaymentDto, @Req() req: Request) {
        const userId = (req as any).user.id;
        return this.paymentsService.confirmPayment(data, userId);
    }

    @Post('refund/:orderId')
    @UseGuards(AuthGuard, new RoleGuard(['admin']))
    refundPayment(@Param('orderId') orderId: string, @Body() data: RefundPaymentDto) {
        return this.paymentsService.refundPayment(orderId, data);
    }

    @Get('status/:orderId')
    @UseGuards(AuthGuard)
    getPaymentStatus(@Param('orderId') orderId: string, @Req() req: Request) {
        const userId = (req as any).user.id;
        return this.paymentsService.getPaymentStatus(orderId, userId);
    }
}
