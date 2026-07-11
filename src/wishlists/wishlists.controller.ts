import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() data: CreateWishlistDto,@Req() req:Request) {
    return this.wishlistsService.create(data,req);
  }

  @Get()
  findAll(@Req() req:Request) {
    return this.wishlistsService.findAll(req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistsService.remove(id);
  }
}
