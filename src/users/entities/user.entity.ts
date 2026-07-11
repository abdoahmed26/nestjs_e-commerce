import { Wishlist } from "../../wishlists/entities/wishlist.entity";
import { Cart } from "../../carts/entities/cart.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "../../reviews/entities/review.entity";
import { Order } from "../../orders/entities/order.entity";
import { OrderItem } from "../../orders/entities/orderItem.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity({name:"users"})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    fullname:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column()
    profileImage:string;

    @Column({type:"enum", enum:UserRole, default:UserRole.USER})
    role:string;

    @CreateDateColumn({type:"timestamp"})
    createdAt:Date;

    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date;

    @OneToMany(() => Cart, (cart) => cart.user)
    carts:Cart[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
    wishlists:Wishlist[];

    @OneToMany(() => Review, (review) => review.user)
    reviews:Review[];

    @OneToMany(() => Order, (order) => order.user)
    orders:Order[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.user)
    orderItems:OrderItem[];
}
