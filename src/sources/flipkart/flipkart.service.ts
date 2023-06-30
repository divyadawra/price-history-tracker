import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Flipkart } from './flipkart.entity';
import { Product } from 'src/product/product.entity';
var scrapeUrl = require('./flipkartScrapper');
import { Cron } from '@nestjs/schedule';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class FlipkartService {

    constructor(
        @InjectRepository(Flipkart)
        private flipkartRespository: Repository<Flipkart>,
        private readonly productService: ProductService
      ) {}
  getProduct(id:number): Promise<Flipkart | null> {
    return this.flipkartRespository.findOneBy({ id });
  }

  saveProduct(product:Flipkart): Promise<Flipkart> {
    return this.flipkartRespository.save(product);
  }

 async scrapeAndSaveProduct(url: string): Promise<Flipkart> {
  
  let product = await this.productService.getProductByName(url);
  console.log(product);
  let scrapedProduct = await scrapeUrl(url);
  console.log(scrapedProduct);
  if (!product) {
    product = new Product();
    product.name = url;
    product.description = scrapedProduct.name;
    product = await this.productService.saveProduct(product);
  } 
  console.log(product);
  scrapedProduct.url = url;
  scrapedProduct.pid = product.id;
  await this.saveProduct(scrapedProduct);
  return scrapedProduct;
  }


  @Cron('1 * * * * *')
  async scrapeCronJob() {
    console.log('Flipkart: Cron Job started');
    let products = await this.productService.getAllProducts();
    products.forEach(async (product) => {
      let url= product.name;
      console.log(url);
      if (url !="" && url.indexOf('flipkart')) {
        await this.scrapeAndSaveProduct(url);
      }

    });
    console.log('Flipkart: Cron Job finished');
  }
}

