import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  getProduct(@Param('id') id: number):Promise<Product> {
    console.log
    return this.productService.getProduct(id);
  }

  @Post()
  saveProduct(@Body() product: Product):Promise<Product> {
    return this.productService.saveProduct(product);
  }
}
