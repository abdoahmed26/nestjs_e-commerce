/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Request } from 'express';
import { pagination } from 'src/helpers/pagination';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(data: CreateReviewDto,req:Request) {
    const userId = (req as any).user.id;
    const product = await this.productRepository.findOne({
      where:{id:data.productId},
    });
    if(!product){
      throw new NotFoundException({status:"error",message:"product not found"});
    }
    const review = this.reviewRepository.create({...data,user:{id:userId},product});
    await this.reviewRepository.save(review);
    return {status:"success",message:"review created successfully"}
  }

  async findAll(id: string,req:Request) {
    const limit = +(req.query.limit || 10);
    const page = +(req.query.page || 1);
    const skip = (page - 1) * limit;
    const [reviews,count] = await this.reviewRepository.findAndCount({
      where:{product:{id}},
      skip,
      take: limit,
      relations:["user"]
    })
    const pagin = pagination(limit,page,count);
    const mapped = reviews.map((review) => {
      return {
        ...review,
        user: {
          id: review.user.id,
          fullname: review.user.fullname,
          email: review.user.email,
          profileImage: review.user.profileImage,
          role: review.user.role,
        },
      };
    });
    return {status:"success",data:{reviews:mapped,pagination:pagin}}
  }

  async update(id: string, data: UpdateReviewDto) {
    const review = await this.reviewRepository.findOneBy({id});
    if(!review){
      throw new NotFoundException({status:"error",message:"review not found"});
    }
    await this.reviewRepository.update({id},data);
    return {status:"success",message:"review updated successfully"};
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findOneBy({id});
    if(!review){
      throw new NotFoundException({status:"error",message:"review not found"});
    }
    await this.reviewRepository.delete({id});
    return {status:"success",message:"review deleted successfully"};
  }
}
