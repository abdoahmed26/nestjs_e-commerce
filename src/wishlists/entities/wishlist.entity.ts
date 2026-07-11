import { Product } from "../../products/entities/product.entity";
import { User } from "../../users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("wishlists")
export class Wishlist {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ManyToOne(() => Product, (product) => product.wishlists,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"productId"})
    product:Product;
    
    @ManyToOne(() => User, (user) => user.wishlists,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    @JoinColumn({name:"userId"})
    user:User;
}
