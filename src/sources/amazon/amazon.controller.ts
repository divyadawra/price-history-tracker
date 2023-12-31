import { Controller, Body, Post } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { Amazon } from './amazon.entity';

@Controller('amazon')
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Post('scrapeUrl')
  async getProduct(@Body('url') url: string):Promise<Amazon> {
    return await this.amazonService.scrapeAndSaveProduct(url);
  }

}
