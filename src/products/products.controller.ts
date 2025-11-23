import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadFile';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(new RoleGuard(['admin']))
  @UseInterceptors(FileInterceptor("image",multerOptions))
  create(@UploadedFile() image: Express.Multer.File,@Body() data: CreateProductDto) {
    if(!image){
      throw new BadRequestException({status:"bad request",message:"image is required"})
    }
    return this.productsService.create(data,image.path);
  }

  @Get()
  findAll(@Req() req:Request) {
    return this.productsService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['admin']))
  @UseInterceptors(FileInterceptor("image",multerOptions))
  update(@Param('id') id: string, @Body() data: UpdateProductDto,@UploadedFile() image: Express.Multer.File) {
    return this.productsService.update(id, data,image ? image.path : null);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
