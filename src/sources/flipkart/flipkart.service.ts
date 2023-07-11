import {  Injectable, HttpStatus, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Flipkart } from './flipkart.entity';
import { Product } from 'src/product/product.entity';
var scrapeUrl = require('./flipkartScrapper');
import { Cron } from '@nestjs/schedule';
import { ProductService } from 'src/product/product.service';
import { AxiosError } from 'axios';

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
  getLastProduct(url: string): Promise<Flipkart[] | null> {
    return this.flipkartRespository.query(`select * from flipkart where url = '${url}' order by priceFetchedAt desc limit 1`);

  }

  saveProduct(product:Flipkart): Promise<Flipkart> {
    return this.flipkartRespository.save(product);
  }

  async scrapeAndSaveProduct(url:string): Promise<Flipkart> {
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
          await this.flipkartRespository.save(scrapedProduct);
        } else {
          console.log(`same prices, don't save`);
        }
      } else if(!alreadyScrapedProduct) {
        await this.flipkartRespository.save(scrapedProduct);
      }  
      return scrapedProduct;
    } catch(exception) {
      console.log(exception);
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

  @Cron('1 * * * * *')
  async scrapeCronJob() {
    console.log('Flipkart: Cron Job started');
    let products = await this.productService.getAllProducts();
    await Promise.all(products.map(async (product) => {
      let url= product.name;
      if (url !="" && (url.indexOf('flipkart') > 0)) {
        await this.scrapeAndSaveProduct(url);
      }
    }));
    console.log('Flipkart: Cron Job finished');
  }
}

