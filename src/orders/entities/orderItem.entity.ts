import { Product } from "../../products/entities/product.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";


@Entity("order_items")
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type:"float",default:1})
    quantity:number;
    
    @Column({type:"float",default:0})
    total:number;
    
    @CreateDateColumn({type:"timestamp"})
    createdAt:Date;
    
    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date;

    @ManyToOne(() => Order, (order) => order.orderItems,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"orderId"})
    order:Order;
    
    @ManyToOne(() => Product, (product) => product.orderItems,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"productId"})
    product:Product;
    
    @ManyToOne(() => User, (user) => user.orderItems,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"userId"})
    user:User;
}