import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import type { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}
  
  @Post()
  @UseGuards(new RoleGuard(['admin']))
  create(@Body() data: CreateCouponDto,@Res() res:Response) {
    return this.couponsService.create(data,res);
  }

  @Get()
  @UseGuards(new RoleGuard(['admin']))
  findAll(@Req() req:Request,@Res() res:Response) {
    return this.couponsService.findAll(req,res);
  }

  @Get(':id')
  @UseGuards(new RoleGuard(['admin']))
  findOne(@Param('id') id: string,@Res() res:Response) {
    return this.couponsService.findOne(id,res);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['admin']))
  update(@Param('id') id: string, @Body() data: UpdateCouponDto,@Res() res:Response) {
    return this.couponsService.update(id, data,res);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string,@Res() res:Response) {
    return this.couponsService.remove(id,res);
  }
}
