import { IsBoolean, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { DiscountType } from "../entities/coupon.entity";

export class CreateCouponDto {
    @IsNotEmpty({message: "Code is required"})
    code:string;
    @IsNotEmpty({message: "Discount type is required"})
    @IsIn([DiscountType.PERCENTAGE, DiscountType.FIXED])
    discountType:DiscountType;
    @IsNotEmpty({message: "Discount value is required"})
    @IsInt({message: "Discount value must be a integer number"})
    discountValue:number;
    @IsOptional()
    @IsInt({message: "Min purchase must be a integer number"})
    minPurchase?:number;
    @IsOptional()
    @IsDateString({strict:true},{message: "Expires at must be a date"})
    expiresAt?:Date;
    @IsOptional()
    @IsBoolean({message: "Is active must be a boolean"})
    isActive?:boolean;
    @IsOptional()
    @IsInt({message: "Usage limit must be an integer"})
    usageLimit?:number;
}
