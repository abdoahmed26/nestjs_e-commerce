import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() data: CreateCartDto,@Req() req:Request) {
    return this.cartsService.create(data,req);
  }

  @Get("mine")
  find(@Req() req:Request) {
    return this.cartsService.find(req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCartDto) {
    return this.cartsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }
}
