import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateWishlistDto {
    @IsNotEmpty({message:"productId is required"})
    @IsUUID("4",{message:"productId must be a valid UUID"})
    productId: string;
}
