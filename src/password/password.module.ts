import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]), EmailSenderModule],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
