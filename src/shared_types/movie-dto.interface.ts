import { Genres } from './genres.type';

export interface MovieDTO {
  id: number;
  title: string;
  year: number;
  runtime: number;
  genres: Genres[];
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
}
