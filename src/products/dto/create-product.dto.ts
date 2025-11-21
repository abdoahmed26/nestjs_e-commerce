import { IsDecimal, IsNotEmpty, IsUUID } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty({message:"title is required"})
    title: string;

    @IsNotEmpty({message:"description is required"})
    description: string;

    @IsNotEmpty({message:"price is required"})
    @IsDecimal({},{message:"price must be an integer"})
    price: number;

    @IsNotEmpty({message:"quantity is required"})
    @IsDecimal({},{message:"quantity must be an integer"})
    quantity: number;

    @IsNotEmpty({message:"categoryId is required"})
    @IsUUID("4",{message:"categoryId must be a valid UUID"})
    categoryId: string;
}
