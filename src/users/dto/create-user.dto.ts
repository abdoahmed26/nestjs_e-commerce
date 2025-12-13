import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message:"fullname is required"})
    fullname:string;

    @IsNotEmpty({message:"email is required"})
    @IsEmail({},{message:"email is not valid"})
    email:string;

    @IsNotEmpty({message:"password is required"})
    @MinLength(6,{message:"password must be at least 6 characters"})
    @MaxLength(20,{message:"password must be at most 20 characters"})
    password:string
}

export class LoginDto{
    @IsNotEmpty({message:"email is required"})
    @IsEmail({},{message:"email is not valid"})
    email:string;

    @IsNotEmpty({message:"password is required"})
    password:string
}
