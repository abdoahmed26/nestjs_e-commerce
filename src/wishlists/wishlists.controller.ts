import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() data: CreateWishlistDto,@Req() req:Request,@Res() res:Response) {
    return this.wishlistsService.create(data,req,res);
  }

  @Get()
  findAll(@Req() req:Request,@Res() res:Response) {
    return this.wishlistsService.findAll(req,res);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Res() res:Response) {
    return this.wishlistsService.remove(id,res);
  }
}
