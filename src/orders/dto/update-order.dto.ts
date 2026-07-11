import { OrderStatus } from '../entities/order.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus, { message: 'Invalid order status' })
    status?: OrderStatus;
}
