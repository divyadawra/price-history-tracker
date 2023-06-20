import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Amazon } from './amazon.entity';
var osmosis = require('osmosis');

@Injectable()
export class AmazonService {

    constructor(
        @InjectRepository(Amazon)
        private amazonRepository: Repository<Amazon>, 
        private dataSource: DataSource
      ) {}
  getProduct(id:number): Promise<Amazon | null> {
    return this.amazonRepository.findOneBy({ id });
  }

  saveProduct(product:Amazon): Promise<Amazon> {
    return this.amazonRepository.save(product);
  }

 async scrapeAndSaveProduct(url:string): Promise<string> {
    scrapeUrl(url).then(data => {
      console.log('data', data);
      this.amazonRepository.save(data);
    });
    // var scrappedProduct = await this.scrapeUrl(url);
    // console.log(" in scrape and save product", scrappedProduct);
    // await this.saveProduct(scrappedProduct);
    return "hello";
  }

 async scrapeUrltest(url:string): Promise<Amazon> {
    var scrappedProduct = new Amazon();
    scrappedProduct['url'] = url;
    scrappedProduct['pid']=1;
    console.log('init');
   scrappedProduct = await osmosis.get(url)
    .find('div#titleSection')
    .set('name', 'span#productTitle')
    .find('div#corePriceDisplay_desktop_feature_div')
    .set({'price': 'span.a-offscreen'})
    .find('div#averageCustomerReviews')
    .set({'ratingCount': 'span#acrCustomerReviewText',
        'rating': 'span.reviewCountTextLinkedHistogram'})
    .find('div#availabilityInsideBuyBox_feature_div')
    .set({
        'inStock':'div#availability'
    })
    .data(function(result) {
      console.log("here");
      for(const key in result) {
        console.log(`${key}: ${result[key]}`);
          scrappedProduct[key] = result[key]
      }
    }).done( () => {
      console.log("in done", scrappedProduct);
      return scrappedProduct;
    });

    console.log("at line 57 ",scrappedProduct);
    return scrappedProduct;
  }
}


function scrapeUrl(url) {
  console.log("in 1");
  return new Promise((resolve, reject) => {
    var scrappedProduct = new Amazon();
    scrappedProduct['url'] = url;
    let results = [];
    osmosis.get(url)
    .find('div#titleSection')
    .set('name', 'span#productTitle')
    .find('div#corePriceDisplay_desktop_feature_div')
    .set({'price': 'span.a-offscreen'})
    .find('div#averageCustomerReviews')
    .set({'ratingCount': 'span#acrCustomerReviewText',
        'rating': 'span.reviewCountTextLinkedHistogram'})
    .find('div#availabilityInsideBuyBox_feature_div')
    .set({
        'inStock':'div#availability'
    })
      .data(result => {
        for(const key in result) {
          console.log(`${key}: ${result[key]}`);
            if (key == 'rating'){
              var splitStr = result[key].split(' ');
              console.log("splitstr:", splitStr);
              result[key] = splitStr[0];
              console.log(result[key]);
            }
            scrappedProduct[key] = result[key]
        }
      })
      .done(() => resolve(scrappedProduct));
  });
}

