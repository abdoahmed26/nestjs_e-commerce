/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Request, Response } from 'express';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(data: CreateWishlistDto,req:Request,res:Response) {
    const userId = (req as any).user.id;
    const product = await this.productRepository.findOneBy({id:data.productId});
    if(!product){
      return res.status(400).json({status:"bad request",message:"product not found"});
    }
    const isExist = await this.wishlistRepository.findOneBy({product:{id:data.productId},user:{id:userId}});
    if(isExist){
      return res.status(400).json({status:"bad request",message:"product already in wishlist"});
    }
    const wishlist = this.wishlistRepository.create({user:{id:userId},product:{id:data.productId}});
    await this.wishlistRepository.save(wishlist);
    return res.status(201).json({status:"success",message:"product added to wishlist successfully"});
  }

  async findAll(req:Request,res:Response) {
    const userId = (req as any).user.id;
    const wishlists = await this.wishlistRepository.find({
      where:{user:{id:userId}},
      relations:["product"]
    })
    return res.status(200).json({status:"success",data:wishlists});
  }

  async remove(id: string,res:Response) {
    const wishlist = await this.wishlistRepository.findOneBy({id});
    if(!wishlist){
      return res.status(400).json({status:"bad request",message:"wishlist not found"});
    }
    await this.wishlistRepository.delete({id});
    return res.status(200).json({status:"success",message:"wishlist deleted successfully"});
  }
}
