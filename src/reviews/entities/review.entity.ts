import { User } from "../../users/entities/user.entity";
import { Product } from "../../products/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("reviews")
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({type:"text"})
    comment:string;

    @Column({type:"int"})
    rating:number;

    @ManyToOne(() => Product, (product) => product.reviews,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"productId"})
    product:Product;

    @ManyToOne(() => User, (user) => user.reviews,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"userId"})
    user:User;

    @CreateDateColumn({type:"timestamp"})
    createdAt:Date;
    
    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date;
}
