import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { Response, Request } from 'express';
import { pagination } from 'src/helpers/pagination';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>
  ){}
  async create(data: CreateCouponDto, res:Response) {
    const coupon = this.couponRepository.create(data);
    await this.couponRepository.save(coupon);
    return res.status(201).json({status:"success",message:"coupon created successfully"});
  }

  async findAll(req:Request,res:Response) {
    const limit = +(req.query.limit || 10);
    const page = +(req.query.page || 1);
    const skip = (page - 1) * limit;
    const [coupons,count] = await this.couponRepository.findAndCount(
      {
        order:{createdAt:"DESC"},
        skip,
        take: limit,
      }
    );
    const pagin = pagination(limit,page,count);
    return res.status(200).json({status:"success",data:{coupons,pagination:pagin}});
  }

  async findOne(id: string, res:Response) {
    const coupon = await this.couponRepository.findOne({
      where:{id},
    });
    if(!coupon){
      return res.status(404).json({status:"not found",message:"coupon not found"});
    }
    return res.status(200).json({status:"success",data:coupon});
  }

  async update(id: string, data: UpdateCouponDto, res:Response) {
    const coupon = await this.couponRepository.findOne({
      where:{id},
    });
    if(!coupon){
      return res.status(404).json({status:"not found",message:"coupon not found"});
    }
    await this.couponRepository.update(id,data);
    return res.status(200).json({status:"success",message:"coupon updated successfully"});
  }

  async remove(id: string, res:Response) {
    const coupon = await this.couponRepository.findOne({
      where:{id},
    });
    if(!coupon){
      return res.status(404).json({status:"not found",message:"coupon not found"});
    }
    await this.couponRepository.delete(id)
    return res.status(200).json({status:"success",message:"coupon deleted successfully"});
  }
}
