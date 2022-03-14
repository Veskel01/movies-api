import { Movie } from '../../modules/movies/movie.model';
import { MovieDTO } from '../../shared_types';
import { BaseRepository } from './base.repository';

export abstract class MovieRepository extends BaseRepository<
  Movie,
  MovieDTO,
  number
> {}
