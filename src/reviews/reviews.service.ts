/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Request, Response } from 'express';
import { pagination } from 'src/helpers/pagination';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(data: CreateReviewDto,req:Request,res:Response) {
    const userId = (req as any).user.id;
    const product = await this.productRepository.findOne({
      where:{id:data.productId},
    });
    if(!product){
      return res.status(400).json({status:"bad request",message:"product not found"});
    }
    const review = this.reviewRepository.create({...data,user:{id:userId},product});
    await this.reviewRepository.save(review);
    return res.status(201).json({
      status:"success",
      message:"review created successfully"
    })
  }

  async findAll(id: string,req:Request,res:Response) {
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
    return res.status(200).json({
      status:"success",
      data:{reviews:mapped,pagination:pagin}
    })
  }

  async update(id: string, data: UpdateReviewDto,res:Response) {
    const review = await this.reviewRepository.findOneBy({id});
    if(!review){
      return res.status(400).json({status:"bad request",message:"review not found"});
    }
    await this.reviewRepository.update({id},data);
    return res.status(200).json({status:"success",message:"review updated successfully"});
  }

  async remove(id: string, res: Response) {
    const review = await this.reviewRepository.findOneBy({id});
    if(!review){
      return res.status(400).json({status:"bad request",message:"review not found"});
    }
    await this.reviewRepository.delete({id});
    return res.status(200).json({status:"success",message:"review deleted successfully"});
  }
}
