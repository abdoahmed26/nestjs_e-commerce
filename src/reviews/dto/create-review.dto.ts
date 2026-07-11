import { IsInt, IsNotEmpty, IsUUID, Max, Min } from "class-validator";


export class CreateReviewDto {
    @IsNotEmpty({message:"comment is required"})
    comment: string;

    @IsNotEmpty({message:"rating is required"})
    @IsInt({message:"rating must be an integer"})
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty({message:"productId is required"})
    @IsUUID("4",{message:"productId must be a valid UUID"})
    productId: string;
}
