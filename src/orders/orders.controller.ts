import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() data: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create(data, req);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.ordersService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrderDto, @Req() req: Request) {
    return this.ordersService.update(id, data, req);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
