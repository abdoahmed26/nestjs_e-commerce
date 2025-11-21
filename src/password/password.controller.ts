import { Controller, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Patch("/update")
  @UseGuards(AuthGuard)
  update(@Body() data: UpdatePasswordDto,@Req() req:Request) {
    return this.passwordService.update(data,req);
  }

  @Patch('/forget')
  forget(@Body() data: ForgetPasswordDto) {
    return this.passwordService.forget(data);
  }

  @Patch('/reset')
  reset(@Body() data: ResetPasswordDto) {
    return this.passwordService.reset(data);
  }
}
