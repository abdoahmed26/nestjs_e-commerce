import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}
  
  @Post()
  @UseGuards(new RoleGuard(['admin']))
  create(@Body() data: CreateCouponDto) {
    return this.couponsService.create(data);
  }

  @Get()
  @UseGuards(new RoleGuard(['admin']))
  findAll(@Req() req:Request) {
    return this.couponsService.findAll(req);
  }

  @Get(':id')
  @UseGuards(new RoleGuard(['admin']))
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['admin']))
  update(@Param('id') id: string, @Body() data: UpdateCouponDto) {
    return this.couponsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
