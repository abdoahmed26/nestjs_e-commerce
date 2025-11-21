import { Product } from "../../products/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    title:string;

    @Column({type:"text",nullable:true})
    description:string;

    @Column({nullable:true})
    image:string;

    @CreateDateColumn({type:"timestamp"})
    createdAt:Date;

    @UpdateDateColumn({type:"timestamp"})
    updatedAt:Date

    @OneToMany(() => Product, (product) => product.category)
    products:Product[]
}
