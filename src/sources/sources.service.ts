import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sources } from './sources.entity';

@Injectable()
export class SourcesService {

    constructor(
        @InjectRepository(Sources)
        private sourcesRepository: Repository<Sources>
      ) {}
  getProduct(id:number): Promise<Sources | null> {
    return this.sourcesRepository.findOneBy({ id });
  }

  saveProduct(sources:Sources): Promise<Sources> {
    return this.sourcesRepository.save(sources);
  }
}