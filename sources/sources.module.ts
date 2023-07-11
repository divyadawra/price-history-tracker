import { Module } from '@nestjs/common';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sources } from './sources.entity';
import { AmazonModule } from './amazon/amazon.module';
import { FlipkartModule } from './flipkart/flipkart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sources]), AmazonModule, FlipkartModule],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}
