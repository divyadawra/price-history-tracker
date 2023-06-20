import { Module } from '@nestjs/common';
import { FlipkartController } from './flipkart.controller';
import { FlipkartService } from './flipkart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flipkart } from './flipkart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flipkart])],
  controllers: [FlipkartController],
  providers: [FlipkartService],
})
export class FlipkartModule {}
