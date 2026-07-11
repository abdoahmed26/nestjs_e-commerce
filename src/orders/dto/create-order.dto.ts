import { IsOptional, IsString } from "class-validator";


export class CreateOrderDto {
    @IsOptional()
    @IsString({ message: "Coupon must be a string" })
    coupon?: string;
}
