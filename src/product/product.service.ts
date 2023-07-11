import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>
      ) {}

  getProductByName(name:string): Promise<Product | null> {
    return this.productsRepository.findOneBy({ name });
  }

  getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }
  getProduct(id:number): Promise<Product | null> {
    return this.productsRepository.findOneBy({ id });
  }
  saveProduct(product:Product): Promise<Product> {
    return this.productsRepository.save(product);
  }
}