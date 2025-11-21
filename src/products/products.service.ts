import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { pagination } from 'src/helpers/pagination';
import { Category } from 'src/categories/entities/category.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private redisService: RedisService,
  ) {}
  async create(data: CreateProductDto, image: string, res: Response) {
    const category = await this.categoryRepository.findOneBy({id:data.categoryId});
    if(!category){
      return res.status(400).json({status:"bad request",message:"category not found"});
    }
    const product = this.productRepository.create({...data,category,image});
    await this.productRepository.save(product);
    return res.status(201).json({status:"success",message:"product created successfully"});
  }

  async findAll(req: Request, res: Response) {
    const limit = +(req.query.limit || 10);
    const page = +(req.query.page || 1);
    const skip = (page - 1) * limit;
    const key = `products${limit}${page}`
    
    const data = await this.redisService.get(key);
    if(data){
      return res.status(200).json({status:"success",path:"cache",data});
    }
    const [products,count] = await this.productRepository.findAndCount({
      skip,
      take: limit,
    })
    const pagin = pagination(limit,page,count);
    await this.redisService.set(key,{products,pagination:pagin},5*60);
    return res.status(200).json({status:"success",path:"db",data:{products,pagination:pagin}});
  }

  async findOne(id: string, res: Response) {
    const product = await this.productRepository.findOne({
      where: {id},
      relations: {category:true}
    });
    if(!product){
      return res.status(400).json({status:"bad request",message:"product not found"});
    }
    return res.status(200).json({status:"success",data:product});
  }

  async update(id: string, data: UpdateProductDto, image: string | null, res: Response) {
    const product = await this.productRepository.findOneBy({id});
    if(!product){
      return res.status(400).json({status:"bad request",message:"product not found"});
    }
    const upImage = image ? image : product.image;
    await this.productRepository.update({id},{...data,image:upImage});
    return res.status(200).json({status:"success",message:"product updated successfully"});
  }

  async remove(id: string, res: Response) {
    const product = await this.productRepository.findOneBy({id});
    if(!product){
      return res.status(400).json({status:"bad request",message:"product not found"});
    }
    await this.productRepository.delete({id});
    return res.status(200).json({status:"success",message:"product deleted successfully"});
  }
}
