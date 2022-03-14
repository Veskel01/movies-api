import { Provider } from '@nestjs/common';
import { MovieRepository } from '../abstractions/movie.repository';
import { MovieRepositoryImpl } from '../implementations/movie-repository.impl';

export const MovieRepositoryProvider: Provider = {
  provide: MovieRepository,
  useClass: MovieRepositoryImpl,
};
