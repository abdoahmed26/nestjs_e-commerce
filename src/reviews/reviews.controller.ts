import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() data: CreateReviewDto,@Req() req:Request) {
    return this.reviewsService.create(data,req);
  }

  @Get(':id') // id => productId
  findAll(@Param('id') id: string,@Req() req:Request) {
    return this.reviewsService.findAll(id,req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateReviewDto) {
    return this.reviewsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
