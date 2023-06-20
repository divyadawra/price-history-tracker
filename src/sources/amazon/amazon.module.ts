import { Module } from '@nestjs/common';
import { AmazonController } from './amazon.controller';
import { AmazonService } from './amazon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amazon } from './amazon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amazon])],
  controllers: [AmazonController],
  providers: [AmazonService],
})
export class AmazonModule {}
