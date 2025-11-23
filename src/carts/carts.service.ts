/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Request } from 'express';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(data: CreateCartDto,req:Request) {
    const product = await this.productRepository.findOneBy({id:data.productId});
    if(!product){
      throw new NotFoundException({status:"error",message:"product not found"});
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
    return {status:"success",message:"cart created successfully"};
  }

  async find(req:Request) {
    const userId = (req as any).user.id;
    const carts = await this.cartRepository.find({
      where:{user:{id:userId}},
      relations:["product"]
    })
    return {status:"success",data:carts};
  }

  async update(id: string, data: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where:{id},
      relations:["product"]
    });
    if(!cart){
      throw new NotFoundException({status:"error",message:"cart not found"});
    }
    const q = data.quantity ? data.quantity : cart.quantity;
    const total = q * cart.product.price;
    await this.cartRepository.update({id},{...data,quantity:q,total});
    return {status:"success",message:"cart updated successfully"};
  }

  async remove(id: string) {
    const cart = await this.cartRepository.findOneBy({id});
    if(!cart){
      throw new NotFoundException({status:"error",message:"cart not found"});
    }
    await this.cartRepository.delete({id});
    return {status:"success",message:"cart deleted successfully"};
  }
}
