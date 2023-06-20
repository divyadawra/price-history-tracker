import { Controller, Body, Post } from '@nestjs/common';
import { AmazonService } from './amazon.service';

@Controller('amazon')
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Post('scrapeUrl')
  async getProduct(@Body('url') url: string):Promise<string> {
    console.log(url);
    return await this.amazonService.scrapeAndSaveProduct(url);
  }

}
