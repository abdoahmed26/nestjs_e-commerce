import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() data: CreateReviewDto,@Req() req:Request,@Res() res:Response) {
    return this.reviewsService.create(data,req,res);
  }

  @Get(':id') // id => productId
  findAll(@Param('id') id: string,@Req() req:Request,@Res() res:Response) {
    return this.reviewsService.findAll(id,req,res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateReviewDto,@Res() res:Response) {
    return this.reviewsService.update(id, data,res);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Res() res:Response) {
    return this.reviewsService.remove(id,res);
  }
}
