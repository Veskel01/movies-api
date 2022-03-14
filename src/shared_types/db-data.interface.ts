import { Genres } from './genres.type';
import { MovieDTO } from './movie-dto.interface';

export interface DbData {
  genres: Genres[];
  movies: MovieDTO[];
}
