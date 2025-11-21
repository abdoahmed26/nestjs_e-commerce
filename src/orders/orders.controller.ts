import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import type { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() data: CreateOrderDto, @Req() req: Request, @Res() res: Response) {
    return this.ordersService.create(data, req, res);
  }

  @Get()
  findAll(@Req() req: Request, @Res() res: Response) {
    return this.ordersService.findAll(req, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.ordersService.findOne(id, res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrderDto, @Req() req: Request, @Res() res: Response) {
    return this.ordersService.update(id, data, req, res);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.ordersService.remove(id, res);
  }
}
