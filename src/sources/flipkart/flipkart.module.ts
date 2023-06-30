import { Module } from '@nestjs/common';
import { FlipkartController } from './flipkart.controller';
import { FlipkartService } from './flipkart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flipkart } from './flipkart.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Flipkart]), ProductModule],
  controllers: [FlipkartController],
  providers: [FlipkartService],
})
export class FlipkartModule {}
