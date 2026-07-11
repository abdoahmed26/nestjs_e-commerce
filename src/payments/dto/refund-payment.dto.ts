import { IsNumber, IsOptional, IsString } from "class-validator";

export class RefundPaymentDto {
    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsString()
    @IsOptional()
    reason?: string;
}
