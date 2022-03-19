import * as fs from 'fs';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectCollection } from '../../database/memory-database/common';
import { Collection } from '../../database/memory-database/core';
import { ApplicationException } from '../../exceptions';
import { Genres, SearchQueryParams, SeedData } from '../../shared_types';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { Movie } from './movie.model';

@Injectable()
export class MoviesService implements OnModuleInit {
  constructor(
    @InjectCollection(Movie)
    private readonly moviesCollection: Collection<number, Movie>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this._loadInitialData();
  }

  public async addNewMovie(createMovieDto: CreateMovieDTO): Promise<Movie> {
    try {
      const movie = await this.moviesCollection.create(
        new Movie(createMovieDto),
      );

      return movie;
    } catch (e) {
      throw new ApplicationException({
        message: 'An error occurred while adding a new movie',
        messageArgs: [],
        messageFormat: 'An error occurred while adding a new movie',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async findWithQueryParams({
    duration,
    genres,
  }: SearchQueryParams): Promise<Movie[]> {
    try {
      const movies = this.moviesCollection.findAll({
        withId: false,
      });

      const moviesData = movies.reduce((acc, curr, idx, arr) => {
        if (!duration && !genres) {
          acc = [arr[Math.floor(Math.random() * arr.length)]];

          return acc;
        }

        if (duration) {
          if (curr.runtime >= -duration && curr.runtime <= +duration) {
            acc.push(curr);
          }
        } else {
          acc = arr;
        }

        if (genres) {
          acc = acc.filter(({ genres: movieGenres }) =>
            (movieGenres || []).some((genre) => genres.includes(genre)),
          );
        }

        return acc;
      }, [] as Movie[]);

      return moviesData.sort((a, b) =>
        this._sortMoviesComparator(genres, a, b),
      );
    } catch (e) {
      console.log(e);

      throw new ApplicationException({
        message: 'An error occurred while downloading movies',
        messageArgs: [],
        messageFormat: 'An error occurred while downloading movies',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async deleteMovie(movieId: number): Promise<void> {
    const movie = this.moviesCollection.findById(movieId);

    if (!movie) {
      throw this.getMovieNotFoundException(movieId);
    }

    await this.moviesCollection.delete(movie.id);
  }

  private _sortMoviesComparator(
    genres: Genres[] = [],
    firstMovie: Movie,
    secondMovie: Movie,
  ): number {
    const matchNumberInFirst = (firstMovie.genres || []).map((genre) =>
      genres.includes(genre),
    );
    const matchNumberInSecond = (secondMovie.genres || []).map((genre) =>
      genres.includes(genre),
    );

    if (matchNumberInFirst > matchNumberInSecond) return -1;
    if (matchNumberInFirst < matchNumberInSecond) return 1;

    return 0;
  }

  private getMovieNotFoundException(movieId: number): ApplicationException {
    return new ApplicationException({
      message: `Movie with id:${movieId} not found`,
      messageArgs: [movieId],
      messageFormat: 'Movie with id:%s not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  private async _loadInitialData(): Promise<void> {
    const readJsonResult = fs.readFileSync(
      `${process.cwd()}/data/db.json`,
      'utf-8',
    );

    const { movies } = JSON.parse(readJsonResult) as SeedData;

    for (let i = 0; i < movies.length; i++) {
      await this.moviesCollection.insert(new Movie(movies[i]));
    }
  }
}
