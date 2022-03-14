import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { Movie } from '../../modules/movies/movie.model';
import { MovieRepository } from '../abstractions/movie.repository';
import { DbData, MovieDTO } from '../../shared_types';

@Injectable()
export class MovieRepositoryImpl extends MovieRepository {
  private readonly _filePath: string = `${process.cwd()}/data/db.json`;

  public async findAll(): Promise<Movie[]> {
    const { movies } = await this.getDbData();

    return movies.map((movie) => new Movie(movie));
  }

  public async findById(id: number): Promise<Movie> {
    const { movies } = await this.getDbData();

    const singleMovieIndex: number = movies.findIndex(
      (movie) => movie.id === id,
    );

    return new Movie(movies[singleMovieIndex]);
  }

  public create(data: Partial<MovieDTO>): Movie {
    return new Movie(data);
  }

  public async save(model: Movie): Promise<Movie> {
    const dbData = await this.getDbData();

    const [lastMovie] = [...dbData.movies.slice(-1)];

    model.setProperties({
      id: (lastMovie.id += 1),
    });

    dbData.movies.push(model);

    await this.writeToDb(dbData);

    return model;
  }

  public async delete(model: Movie): Promise<void> {
    const dbData = await this.getDbData();

    const movieToDeleteIndex = dbData.movies.findIndex(
      (movie) => movie.id === model.id,
    );

    dbData.movies.splice(movieToDeleteIndex, 1);

    await this.writeToDb(dbData);
  }

  private async writeToDb(data: unknown): Promise<void> {
    const dataToInsert = JSON.stringify(data, null, 4);

    await fs.promises.writeFile(this._filePath, dataToInsert);
  }

  private async getDbData(): Promise<DbData> {
    const readJsonResult = await fs.promises.readFile(this._filePath, 'utf-8');

    const result = JSON.parse(readJsonResult) as DbData;

    return result;
  }
}
