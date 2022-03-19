import { AbstractEntity } from '../../shared';
import { Genres, MovieDTO } from '../../shared_types';

export class Movie extends AbstractEntity<number> implements MovieDTO {
  constructor(data?: Partial<MovieDTO>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

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
      runtime: Number(data.runtime),
      year: Number(data.year),
    });
  }
}
