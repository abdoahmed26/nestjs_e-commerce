import { Wishlist } from "../../wishlists/entities/wishlist.entity";
import { Cart } from "../../carts/entities/cart.entity";
import { Category } from "../../categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "../../reviews/entities/review.entity";
import { OrderItem } from "../../orders/entities/orderItem.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    title:string;

    @Column({type:"text"})
    description:string;

    @Column({type:"float"})
    price:number;

    @Column()
    image:string;

    @Column({type:"int"})
    quantity:number;

    @CreateDateColumn({type:"timestamp"})
    createdAt:Date;

    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date

    @ManyToOne(() => Category, (category) => category.products,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"categoryId"})
    category:Category

    @OneToMany(() => Cart, (cart) => cart.product)
    carts:Cart[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
    wishlists:Wishlist[];

    @OneToMany(() => Review, (review) => review.product)
    reviews:Review[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems:OrderItem[];
}
