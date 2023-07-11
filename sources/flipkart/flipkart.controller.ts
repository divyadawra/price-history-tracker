import { Controller, Body, Post } from '@nestjs/common';
import { FlipkartService } from './flipkart.service';
import { Flipkart } from './flipkart.entity';

@Controller('flipkart')
export class FlipkartController {
  constructor(private readonly flipkartService: FlipkartService) {}

  @Post('scrapeUrl')
  async getProduct(@Body('url') url: string):Promise<Flipkart> {
    console.log(url);
    return this.flipkartService.scrapeAndSaveProduct(url);
  }

}
