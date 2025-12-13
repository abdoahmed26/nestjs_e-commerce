import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { pagination } from 'src/helpers/pagination';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private redisService: RedisService,
  ){}
  async create(data: CreateCategoryDto,image:string | undefined) {
    const newCategory = this.categoryRepository.create({...data,image})
    await this.categoryRepository.save(newCategory)
    return {status:"success",message:"category created successfully"};
  }

  async findAll(req:Request) {
    const limit = +(req.query.limit || 10);
    const page = +(req.query.page || 1);
    const skip = (page - 1) * limit;
    const key = `categories${limit}${page}`
    const data = await this.redisService.get(key);
    if(data){
      return {status:"success",path:"cache",data};
    }
    const [categories,count] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
    })
    const pagin = pagination(limit,page,count);
    await this.redisService.set(key,{categories,pagination:pagin},5*60);
    return {status:"success",data:{categories,pagination:pagin}};
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({id})
    if(!category){
      throw new NotFoundException({status:"error",message:"category not found"})
    }
    return {status:"success",data:category};
  }

  async update(id: string, data: UpdateCategoryDto,image:string | null) {
    const category = await this.categoryRepository.findOneBy({id})
    if(!category){
      throw new NotFoundException({status:"error",message:"category not found"})
    }
    const upImage = image ? image : category.image
    await this.categoryRepository.update({id},{...data,image:upImage})
    return {status:"success",message:"category updated successfully"};
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOneBy({id});
    if(!category){
      throw new NotFoundException({status:"error",message:"category not found"})
    }
    await this.categoryRepository.delete({id});
    return {status:"success",message:"category deleted successfully"};
  }
}
