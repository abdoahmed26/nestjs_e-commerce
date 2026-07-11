import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { pagination } from 'src/helpers/pagination';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>
  ){}
  async create(data: CreateCouponDto) {
    const coupon = this.couponRepository.create(data);
    await this.couponRepository.save(coupon);
    return {status:"success",message:"coupon created successfully"};
  }

  async findAll(req:Request) {
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
    return {status:"success",data:{coupons,pagination:pagin}};
  }

  async findOne(id: string) {
    const coupon = await this.couponRepository.findOne({
      where:{id},
    });
    if(!coupon){
      throw new NotFoundException({status:"error",message:"coupon not found"});
    }
    return {status:"success",data:coupon};
  }

  async update(id: string, data: UpdateCouponDto) {
    const coupon = await this.couponRepository.findOne({
      where:{id},
    });
    if(!coupon){
      throw new NotFoundException({status:"error",message:"coupon not found"});
    }
    await this.couponRepository.update(id,data);
    return {status:"success",message:"coupon updated successfully"};
  }

  async remove(id: string) {
    const coupon = await this.couponRepository.findOne({
      where:{id},
    });
    if(!coupon){
      throw new NotFoundException({status:"error",message:"coupon not found"});
    }
    await this.couponRepository.delete(id)
    return {status:"success",message:"coupon deleted successfully"};
  }
}
