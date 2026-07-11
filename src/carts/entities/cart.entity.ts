import { User } from "../../users/entities/user.entity";
import { Product } from "../../products/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("carts")
export class Cart {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column({type:"float",default:1})
    quantity:number;

    @Column({type:"float",default:0})
    total:number;

    @CreateDateColumn({type:"timestamp"})
    createdAt:Date;

    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date;

    @ManyToOne(() => Product, (product) => product.carts,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"productId"})
    product:Product;

    @ManyToOne(() => User, (user) => user.carts,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"userId"})
    user:User;
}
