import {IsInt, IsNotEmpty, IsUUID } from "class-validator";


export class CreateCartDto {
    @IsNotEmpty({message:"productId is required"})
    @IsUUID("4",{message:"productId must be a valid UUID"})
    productId:string;

    @IsNotEmpty({message:"quantity is required"})
    @IsInt({message:"quantity must be an integer"})
    quantity:number
}
