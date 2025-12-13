import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadFile';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(new RoleGuard(['admin']))
  @UseInterceptors(FileInterceptor("image",multerOptions))
  create(@Body() data: CreateCategoryDto,@UploadedFile() image: Express.Multer.File) {
    return this.categoriesService.create(data,image ? image.path : undefined);
  }

  @Get()
  findAll(@Req() req:Request) {
    return this.categoriesService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['admin']))
  @UseInterceptors(FileInterceptor("image",multerOptions))
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto,@UploadedFile() image: Express.Multer.File) {
    return this.categoriesService.update(id, data,image ? image.path : null);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
