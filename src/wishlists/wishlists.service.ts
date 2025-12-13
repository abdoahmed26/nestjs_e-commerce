/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Request } from 'express';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(data: CreateWishlistDto,req:Request) {
    const userId = (req as any).user.id;
    const product = await this.productRepository.findOneBy({id:data.productId});
    if(!product){
      throw new NotFoundException({status:"error",message:"product not found"});
    }
    const isExist = await this.wishlistRepository.findOneBy({product:{id:data.productId},user:{id:userId}});
    if(isExist){
      throw new BadRequestException({status:"bad request",message:"product already in wishlist"});
    }
    const wishlist = this.wishlistRepository.create({user:{id:userId},product:{id:data.productId}});
    await this.wishlistRepository.save(wishlist);
    return {status:"success",message:"product added to wishlist successfully"};
  }

  async findAll(req:Request) {
    const userId = (req as any).user.id;
    const wishlists = await this.wishlistRepository.find({
      where:{user:{id:userId}},
      relations:["product"]
    })
    return {status:"success",data:wishlists};
  }

  async remove(id: string) {
    const wishlist = await this.wishlistRepository.findOneBy({id});
    if(!wishlist){
      throw new NotFoundException({status:"error",message:"wishlist not found"});
    }
    await this.wishlistRepository.delete({id});
    return {status:"success",message:"wishlist deleted successfully"};
  }
}
