import {  Injectable, HttpStatus, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amazon } from './amazon.entity';
var scrapeUrl = require('./amazonScrapper');
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { Cron } from '@nestjs/schedule';
import { AxiosError } from 'axios';


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

  getLastProduct(url: string): Promise<Amazon[] | null> {
    return this.amazonRepository.query(`select * from amazon where url = '${url}' order by priceFetchedAt desc limit 1`);

  }

  saveProduct(product:Amazon): Promise<Amazon> {
    return this.amazonRepository.save(product);
  }

 async scrapeAndSaveProduct(url:string): Promise<Amazon> {
    if (!url) {
      throw new Error(`Invalid url`);
    }
    try {
      let product = await this.productService.getProductByName(url);
   
      let scrapedProduct = await scrapeUrl(url);
       
      if (!product) {
        product = new Product();
        product.name = url;
        product.description = scrapedProduct.name;
        product = await this.productService.saveProduct(product);
      }   
      scrapedProduct.url = url;
      scrapedProduct.pid = product.id;
      let alreadyScrapedProduct = await this.getLastProduct(url);
      // if the product is already scraped in past, check if there is any change in the price.
      if (alreadyScrapedProduct && alreadyScrapedProduct.length > 0) {
        let price = alreadyScrapedProduct[0].price;
        if (parseFloat(price) != parseFloat(scrapedProduct.price)) {
          await this.amazonRepository.save(scrapedProduct);
        } else {
          console.log(`same prices, don't save`);
        }
      } else if(!alreadyScrapedProduct) {
        await this.amazonRepository.save(scrapedProduct);
      }  
      return scrapedProduct;
    } catch(exception) {
      if (exception instanceof AxiosError){
        throw new BadRequestException('Incorrect URL', url);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Something went wrong',
      }, HttpStatus.FORBIDDEN, {
        cause: exception
      });
    }
    
  }

  // @Cron('10 * * * * *')
  async scrapeCronJob() {
    console.log('AMAZON: Cron Job started');
    let products = await this.productService.getAllProducts();
    await Promise.all(products.map(async (product) => {
      let url= product.name;
      if (url !="" && (url.indexOf('amazon') > 0)) {
        await this.scrapeAndSaveProduct(url);
      }
    }));
    console.log('AMAZON: Cron Job finished');
  }
}
