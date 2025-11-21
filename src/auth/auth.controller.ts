import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadFile';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    login(@Body() body:LoginDto) {
        return this.authService.login(body);
    }

    @Post("register")
    @UseInterceptors(FileInterceptor('profileImage',multerOptions))
    register(@UploadedFile() profileImage: Express.Multer.File,@Body() body:CreateUserDto) {
        if(!profileImage){
            throw new BadRequestException({status:"bad request",message:"profile image is required"})
        }
        return this.authService.register(body,profileImage.path);
    }
}
