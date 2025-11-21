import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { afterRegister } from 'src/helpers/messages';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private emailSenderService: EmailSenderService
    ) {}

    async login(data:LoginDto){
        const user = await this.userRepository.findOneBy({email:data.email});
        if(!user){
            throw new NotFoundException({status:"error",message:"user not found"})
        }
        const isMatch = await bcrypt.compare(data.password,user.password);
        if(!isMatch){
            throw new BadRequestException({status:"bad request",message:"password is incorrect"})
        }
        const payload = {id:user.id,email:user.email,role:user.role};
        const token = this.jwtService.sign(payload,{expiresIn:"1d"});
        return {status:"success",data:{token}}
    }

    async register(data:CreateUserDto,profileImage:string){
        const user = await this.userRepository.findOneBy({email:data.email});
        if(user){
            throw new BadRequestException({status:"bad request",message:"user already exists"})
        }
        const hashedPassword = await bcrypt.hash(data.password,10);
        const newUser = this.userRepository.create({...data,profileImage,password:hashedPassword});
        await this.userRepository.save(newUser);
        await this.emailSenderService.sendEmail(newUser.email,"Welcome to our store",afterRegister(newUser.fullname));
        return {status:"success",message:"user created successfully"};
    }
}
