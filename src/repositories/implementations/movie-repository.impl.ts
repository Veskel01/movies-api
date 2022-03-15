import { Injectable } from '@nestjs/common';
import { Movie } from '../../modules/movies/movie.model';
import { MovieRepository } from '../abstractions/movie.repository';
import { MovieDTO, MemoryDbCollections } from '../../shared_types';
import { MemoryDatabase } from '../../database/memory-database';

@Injectable()
export class MovieRepositoryImpl extends MovieRepository {
  private _db: MemoryDatabase;

  private readonly _moviesCollection: Map<number, MovieDTO>;

  constructor() {
    super();
    const db = MemoryDatabase.getInstance();

    this._db = db;

    this._moviesCollection = db.getCollection<number, MovieDTO>(
      MemoryDbCollections.MOVIES,
    );
  }

  public findAll(): Movie[] {
    const result: MovieDTO[] = [];

    this._moviesCollection.forEach((movie) => {
      result.push(movie);
    });

    return result.map((movie) => new Movie(movie));
  }

  public findById(id: number): Movie | null {
    const singleMovie = this._moviesCollection.get(id);

    if (!singleMovie) {
      return null;
    }

    return new Movie(singleMovie);
  }

  public async create(data: Partial<MovieDTO>): Promise<Movie> {
    const movie = new Movie(data);

    const movieId = await this._db.insert<number, Movie>(
      MemoryDbCollections.MOVIES,
      movie,
    );

    return new Movie({
      id: movieId,
      ...data,
    });
  }

  public async save(model: Movie): Promise<Movie> {
    const movieId = await this._db.insert<number, Movie>(
      MemoryDbCollections.MOVIES,
      model,
    );

    model.setProperties({
      id: movieId,
    });

    return model;
  }

  public async delete(model: Movie): Promise<void> {
    await this._db.delete(model.id, MemoryDbCollections.MOVIES);
  }
}
