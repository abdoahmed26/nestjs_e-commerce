import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { pagination } from 'src/helpers/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findAll(req:Request) {
    const limit = +(req.query.limit || 10);
    const page = +(req.query.page || 1);
    const skip = (page - 1) * limit;
    const [users,count] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      select:{
        id:true,
        email:true,
        fullname:true,
        profileImage:true,
        role:true,
        createdAt:true,
        updatedAt:true,
      }
    });
    const pagin = pagination(limit,page,count);
    return {status:"success",data:{users,pagination:pagin}}
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select:{
        id:true,
        email:true,
        fullname:true,
        profileImage:true,
        role:true,
        createdAt:true,
        updatedAt:true,
      }
    },);
    if(!user){
      throw new NotFoundException({status:"error",message:"user not found"})
    }
    return {status:"success",data:user};
  }

  async update(id: string, updateUserDto: UpdateUserDto,profileImage:string | null) {
    const user = await this.userRepository.findOneBy({id});
    if(!user){
      throw new NotFoundException({status:"error",message:"user not found"})
    }
    const upImage = profileImage ? profileImage : user.profileImage;
    await this.userRepository.update({id},{...updateUserDto,profileImage:upImage});
    return {status:"success",message:"user updated successfully"};
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({id});
    if(!user){
      throw new NotFoundException({status:"error",message:"user not found"})
    }
    await this.userRepository.delete({id});
    return {status:"success",message:"user deleted successfully"};
  }
}
