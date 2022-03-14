import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../repositories';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [RepositoryModule.forRepositories(['movie'])],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
