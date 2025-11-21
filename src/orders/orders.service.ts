/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Request, Response } from 'express';
import { Cart } from 'src/carts/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { pagination } from 'src/helpers/pagination';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { afterOrder } from 'src/helpers/messages';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private emailSenderService: EmailSenderService
  ){}
  async create(data: CreateOrderDto, req:Request, res:Response) {
    const userId = (req as any).user.id;
    const cart = await this.cartRepository.find({where: {user:{id:userId}}, relations:["product","user"]});
    if(!cart || cart.length === 0){
      return res.status(400).json({status:"bad request",message: 'No items in cart'});
    }
    let subtotal = 0;
    for(let i=0; i<cart.length; i++){
      subtotal += Number(cart[i].product.price) * Number(cart[i].quantity);
    }
    let discount = 0;
    let appliedCoupon: Coupon | null = null;
    if(data.coupon){
      const coupon = await this.couponRepository.findOne({where: {code: data.coupon}});
      if(!coupon){
        return res.status(400).json({status:"bad request",message: 'Invalid coupon'});
      }
      if(!coupon.isActive){
        return res.status(400).json({status:"bad request",message: 'Coupon is not active'});
      }
      if(coupon.expiresAt && coupon.expiresAt < new Date()){
        return res.status(400).json({status:"bad request",message: 'Coupon has expired'});
      }
      if(coupon.usageLimit && coupon.usedCount >= coupon.usageLimit){
        return res.status(400).json({status:"bad request",message: 'Coupon usage limit reached'});
      }
      if(coupon.minPurchase && subtotal < coupon.minPurchase){
        return res.status(400).json({status:"bad request",message: 'Minimum purchase amount not met'});
      }
      discount = coupon.discountType === 'percentage' ? subtotal * (Number(coupon.discountValue) / 100) : Number(coupon.discountValue);
      appliedCoupon = coupon;
    }
    const total = subtotal - discount;
    const order = this.orderRepository.create({
      user:{id:userId},
      coupon:appliedCoupon ? {id:appliedCoupon.id} : undefined,
      discount,
      total,
      subtotal,
      paymentMethod:"cash_on_delivery",
    })
    await this.orderRepository.save(order);
    const orderItems = cart.map(item => 
      this.orderItemRepository.create({
        order: order,
        product: {id: item.product.id},
        quantity: item.quantity,
        total: item.quantity * item.product.price,
        user: {id: userId},
      })
    )
    await this.orderItemRepository.save(orderItems);

    for(let i=0; i<cart.length; i++){
      await this.productRepository.decrement({id: cart[i].product.id}, 'quantity', cart[i].quantity);
    }

    if(appliedCoupon){
      await this.couponRepository.increment({id: appliedCoupon.id}, 'usedCount', 1);
    }

    await this.cartRepository.delete({user: {id: userId}});
    
    await this.emailSenderService.sendEmail(cart[0].user.email,"Order Placed Successfully",afterOrder(cart[0].user.fullname,order.id, order.total, cart.map(item => ({name: item.product.title, quantity: item.quantity, price: item.product.price}))));

    return res.status(201).json({status:"success",message: 'Order placed successfully',data: order});
  }

  async findAll(req:Request, res:Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    const skip = (page - 1) * limit;
    let where = {};
    if((req as any).user.role !== "admin"){
      where = {user: {id: (req as any).user.id}};
    }
    const [orders, count] = await this.orderRepository.findAndCount({
      where,
      skip,
      take: limit,
    });
    const pagin = pagination(limit,page,count)
    return res.status(200).json({status:"success",message: 'Orders fetched successfully',data: {orders,pagination: pagin}});
  }

  async findOne(id: string, res:Response) {
    const order = await this.orderRepository.findOne({where: {id}});
    if(!order){
      return res.status(404).json({status:"not found",message: 'Order not found'});
    }
    return res.status(200).json({status:"success",message: 'Order fetched successfully',data: order});
  }

  async update(id: string, data: UpdateOrderDto, req:Request, res:Response) {
    const order = await this.orderRepository.findOne({where: {id}});
    if(!order){
      return res.status(404).json({status:"not found",message: 'Order not found'});
    }
    const role = (req as any).user.role;
    if(role !== 'admin' && data.status !== OrderStatus.CANCELED){
      return res.status(403).json({status:"forbidden",message: 'You are not authorized to update this order'});
    }
    await this.orderRepository.update(id, {...data});
    return res.status(200).json({status:"success",message: 'Order updated successfully'});
  }

  async remove(id: string, res:Response) {
    const order = await this.orderRepository.findOne({where: {id}});
    if(!order){
      return res.status(404).json({status:"not found",message: 'Order not found'});
    }
    await this.orderRepository.delete(id);
    return res.status(200).json({status:"success",message: 'Order deleted successfully'});
  }
}
