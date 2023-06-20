import { Controller, Post, Body } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { Sources } from './sources.entity';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post('saveProduct')
  async getProduct(@Body() source:Sources):Promise<Sources> {
    return await this.sourcesService.saveProduct(source);
  }

}
