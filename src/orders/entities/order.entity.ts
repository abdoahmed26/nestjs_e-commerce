import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { Coupon } from "../../coupons/entities/coupon.entity";

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
}
@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ default: 'cash_on_delivery' })
    paymentMethod: string;

    @CreateDateColumn({type:"timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type:"timestamp"})
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.orders,{
        onDelete:"SET NULL",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"userId"})
    user:User;

    orderItems:OrderItem[];

    @ManyToOne(() => Coupon, { nullable: true })
    coupon?: Coupon;
}
