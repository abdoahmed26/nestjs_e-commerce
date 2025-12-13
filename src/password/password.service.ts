/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { afterForgetPass } from 'src/helpers/messages';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailSenderService,
  ){}

  async update(data: UpdatePasswordDto, req: Request) {
    const userId = (req as any).user.id;
    const user = await this.userRepository.findOne({
      where: {id: userId}
    });
    if(!user){
      throw new NotFoundException({status:"error",message: "User not found"})
    }
    const isMatch = await bcrypt.compare(data.oldPassword, user.password);
    if(!isMatch){
      throw new BadRequestException({status:"bad request",message: 'Invalid password'})
    }
    const hashPass = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.update({id: userId}, {password: hashPass});
    return {status:"success",message: 'Password updated successfully'}
  }

  async forget(data: ForgetPasswordDto) {
    const user = await this.userRepository.findOneBy({email: data.email});
    if(!user){
      throw new NotFoundException({status:"error",message: "User not found"})
    }
    const token = this.jwtService.sign({id: user.id},{expiresIn : "5m"});
    const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await this.emailService.sendEmail(user.email, "Reset Password", afterForgetPass(user.fullname,url));
    return {status:"success",message: 'Password reset link sent successfully'}
  }

  async reset(data: ResetPasswordDto) {
    try {
      const user = await this.jwtService.verify(data.token)
      const hashPass = await bcrypt.hash(data.password, 10);
      await this.userRepository.update({id: user.id}, {password: hashPass});
      return {status:"success",message: 'Password reset successfully'}
    } catch(err) {
      throw new UnauthorizedException(err.message);
    }
  }

}
