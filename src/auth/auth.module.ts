import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { EmailSenderModule } from '../email-sender/email-sender.module';
import { GoogleStrategy } from '../common/strategy/google.strategy';

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
  providers: [AuthService, GoogleStrategy]
})
export class AuthModule {}
