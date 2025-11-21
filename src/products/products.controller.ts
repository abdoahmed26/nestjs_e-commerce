import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/uploadFile';
import type { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(new RoleGuard(['admin']))
  @UseInterceptors(FileInterceptor("image",multerOptions))
  create(@UploadedFile() image: Express.Multer.File,@Body() data: CreateProductDto,@Res() res: Response) {
    if(!image){
      return res.status(400).json({status:"bad request",message:"image is required"});
    }
    return this.productsService.create(data,image.path,res);
  }

  @Get()
  findAll(@Req() req:Request,@Res() res:Response) {
    return this.productsService.findAll(req,res);
  }

  @Get(':id')
  findOne(@Param('id') id: string,@Res() res:Response) {
    return this.productsService.findOne(id,res);
  }

  @Patch(':id')
  @UseGuards(new RoleGuard(['admin']))
  @UseInterceptors(FileInterceptor("image",multerOptions))
  update(@Param('id') id: string, @Body() data: UpdateProductDto,@UploadedFile() image: Express.Multer.File,@Res() res: Response) {
    return this.productsService.update(id, data,image ? image.path : null,res);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(['admin']))
  remove(@Param('id') id: string,@Res() res:Response) {
    return this.productsService.remove(id,res);
  }
}
