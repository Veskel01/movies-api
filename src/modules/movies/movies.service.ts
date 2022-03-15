import { HttpStatus, Injectable } from '@nestjs/common';
import { ApplicationException } from '../../exceptions';
import { MovieRepository } from '../../repositories';
import { Genres, SearchQueryParams } from '../../shared_types';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { Movie } from './movie.model';

@Injectable()
export class MoviesService {
  constructor(private readonly movieRepository: MovieRepository) {}

  public async addNewMovie(createMovieDto: CreateMovieDTO): Promise<Movie> {
    try {
      const movie = await this.movieRepository.create(createMovieDto);

      return movie;
    } catch (e) {
      throw new ApplicationException({
        message: 'An error occurred while adding a new movie',
        messageArgs: [],
        messageFormat: 'An error occurred while adding a new video',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async findWithQueryParams({
    duration,
    genres,
  }: SearchQueryParams): Promise<Movie[]> {
    try {
      const movies = await this.movieRepository.findAll();

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
            movieGenres.some((genre) => genres.includes(genre)),
          );
        }

        return acc;
      }, [] as Movie[]);

      return moviesData.sort((a, b) =>
        this._sortMoviesComparator(genres, a, b),
      );
    } catch (e) {
      throw new ApplicationException({
        message: 'An error occurred while downloading movies',
        messageArgs: [],
        messageFormat: 'An error occurred while downloading videos',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async deleteMovie(movieId: number): Promise<void> {
    const movie = await this.movieRepository.findById(movieId);

    if (!movie) {
      throw this.getMovieNotFoundException(movieId);
    }

    await this.movieRepository.delete(movie);
  }

  private _sortMoviesComparator(
    genres: Genres[] = [],
    firstMovie: Movie,
    secondMovie: Movie,
  ): number {
    const matchNumberInFirst = firstMovie.genres.map((genre) =>
      genres.includes(genre),
    );
    const matchNumberInSecond = secondMovie.genres.map((genre) =>
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
}
