import { Genres } from './genres.type';

export interface SearchQueryParams {
  duration?: number;
  genres?: Genres[];
}
