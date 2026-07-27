import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Cart } from '../carts/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { EmailSenderModule } from '../email-sender/email-sender.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Coupon, Cart, Product]), EmailSenderModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
