import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Flipkart } from './flipkart.entity';
var osmosis = require('osmosis');
var scrapeUrl = require('./flipkartScrapper');

@Injectable()
export class FlipkartService {

    constructor(
        @InjectRepository(Flipkart)
        private flipkartRespository: Repository<Flipkart>
      ) {}
  getProduct(id:number): Promise<Flipkart | null> {
    return this.flipkartRespository.findOneBy({ id });
  }

  saveProduct(product:Flipkart): Promise<Flipkart> {
    return this.flipkartRespository.save(product);
  }

 async scrapeAndSaveProduct(url: string): Promise<Flipkart> {
    let product = new Flipkart();
    console.log(url);
   product = await scrapeUrl(url);
   product.url = url;
   product.priceFetchedAt = (new Date()).toLocaleString();
   this.saveProduct(product);
   console.log(product);
   return product;
  }
}

