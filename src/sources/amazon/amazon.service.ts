import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Amazon } from './amazon.entity';
var scrapeUrl = require('./amazonScrapper');
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class AmazonService {

    constructor(
        @InjectRepository(Amazon)
        private amazonRepository: Repository<Amazon>,
        private readonly productService: ProductService
      ) {}
    
      
  getProduct(id:number): Promise<Amazon | null> {
    return this.amazonRepository.findOneBy({ id });
  }

  saveProduct(product:Amazon): Promise<Amazon> {
    return this.amazonRepository.save(product);
  }

 async scrapeAndSaveProduct(url:string): Promise<string> {
   
    let product = await this.productService.getProductByName(url);
   
    let scrapedProduct = await scrapeUrl(url);
     
    if (!product) {
      product = new Product();
      product.name = url;
      product.description = scrapedProduct.name;
      product = await this.productService.saveProduct(product);
    }   
    console.log(product);
    scrapedProduct.url = url;
    scrapedProduct.pid = product.id;
    await this.amazonRepository.save(scrapedProduct);
    return scrapedProduct;
  }

  @Cron('* * 10 * * *')
  async scrapeCronJob() {
    console.log('AMAZON: Cron Job started');
    let products = await this.productService.getAllProducts();
    products.forEach(async (product) => {
      let url= product.name;
      console.log(url);
      if (url !="" && url.indexOf('amazon')) {
        await this.scrapeAndSaveProduct(url);
      }

    });
    console.log('AMAZON: Cron Job finished');
  }
}
