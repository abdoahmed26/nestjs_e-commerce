import { IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {
    @IsNotEmpty({message:"email is required"})
    email:string;
}

export class ResetPasswordDto {
    @IsNotEmpty({message:"password is required"})
    password:string;

    @IsNotEmpty({message:"token is required"})
    token:string;
}
