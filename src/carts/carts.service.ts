/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Request, Response } from 'express';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(data: CreateCartDto,req:Request,res:Response) {
    const product = await this.productRepository.findOneBy({id:data.productId});
    if(!product){
      return res.status(400).json({status:"bad request",message:"product not found"});
    }
    const userId = (req as any).user.id;
    const cart = await this.cartRepository.findOneBy({product:{id:data.productId},user:{id:userId}});
    if(cart){
      const q = data.quantity + cart.quantity;
      const total = q * product.price;
      await this.cartRepository.update({id:cart.id},{quantity:q,total});
    }else{
      const total = product.price * data.quantity;
      const newCart = this.cartRepository.create({...data,user:{id:userId},product,total});
      await this.cartRepository.save(newCart);
    }
    return res.status(201).json({status:"success",message:"cart created successfully"});
  }

  async find(req:Request,res:Response) {
    const userId = (req as any).user.id;
    const carts = await this.cartRepository.find({
      where:{user:{id:userId}},
      relations:["product"]
    })
    return res.status(200).json({status:"success",data:carts});
  }

  async update(id: string, data: UpdateCartDto,res:Response) {
    const cart = await this.cartRepository.findOne({
      where:{id},
      relations:["product"]
    });
    if(!cart){
      return res.status(400).json({status:"bad request",message:"cart not found"});
    }
    const q = data.quantity ? data.quantity : cart.quantity;
    const total = q * cart.product.price;
    await this.cartRepository.update({id},{...data,quantity:q,total});
    return res.status(200).json({status:"success",message:"cart updated successfully"});
  }

  async remove(id: string,res:Response) {
    const cart = await this.cartRepository.findOneBy({id});
    if(!cart){
      return res.status(400).json({status:"bad request",message:"cart not found"});
    }
    await this.cartRepository.delete({id});
    return res.status(200).json({status:"success",message:"cart deleted successfully"});
  }
}
