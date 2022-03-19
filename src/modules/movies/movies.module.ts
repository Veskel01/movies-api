import { Module } from '@nestjs/common';
import { MemoryDatabaseModule } from '../../database/memory-database/memory-database.module';
import { Movie } from './movie.model';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    MemoryDatabaseModule.forFeature({
      entities: [Movie],
      idType: 'uuid',
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
