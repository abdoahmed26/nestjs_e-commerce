import { Order } from "../../orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}
@Entity('coupons')
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    code:string;

    @Column({ type: 'enum', enum: DiscountType })
    discountType:string;

    @Column({type: 'decimal', precision: 10, scale: 2})
    discountValue:number;

    @Column({ nullable: true })
    minPurchase?: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @Column({ default: 0 })
    usedCount: number;

    @Column({ nullable: true })
    usageLimit?: number;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp'})
    updatedAt: Date;

    @ManyToOne(() => Order, (order) => order.coupon)
    orders:Order[]
}
