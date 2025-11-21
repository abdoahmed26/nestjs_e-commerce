import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([User]),
    EmailSenderModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
