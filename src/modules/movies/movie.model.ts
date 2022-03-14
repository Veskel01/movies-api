import { Genres, MovieDTO } from '../../shared_types';

export class Movie implements MovieDTO {
  constructor(data?: Partial<MovieDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: number;

  public genres: Genres[];

  public actors: string;

  public director: string;

  public plot: string;

  public posterUrl: string;

  public runtime: number;

  public title: string;

  public year: number;

  public setProperties(data: Partial<MovieDTO>): void {
    Object.assign(this, {
      ...data,
      runtime: +data.runtime,
      year: +data.year,
    });
  }
}
