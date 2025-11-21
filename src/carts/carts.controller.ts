import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() data: CreateCartDto,@Req() req:Request,@Res() res:Response) {
    return this.cartsService.create(data,req,res);
  }

  @Get("mine")
  find(@Req() req:Request,@Res() res:Response) {
    return this.cartsService.find(req,res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCartDto,@Res() res:Response) {
    return this.cartsService.update(id, data,res);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Res() res:Response) {
    return this.cartsService.remove(id,res);
  }
}
