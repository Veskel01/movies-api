import {
  Body,
  Param,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { MovieRepository } from '../../repositories';
import { Genres } from '../../shared_types';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { Movie } from './movie.model';
import { MoviesService } from './movies.service';

@Controller('/movies')
export class MoviesController {
  constructor(
    private readonly movieService: MoviesService,
    private readonly movieRepository: MovieRepository,
  ) {}

  @Get()
  public async test(
    @Query('duration')
    duration?: number,
    @Query('genres') genres?: Genres[],
  ): Promise<Movie[]> {
    const result = await this.movieService.findWithQueryParams({
      genres,
      duration,
    });

    return result;
  }

  @Post('/create')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  )
  public async createNewMovie(
    @Body() createMovieDto: CreateMovieDTO,
  ): Promise<Movie> {
    const movie = await this.movieService.addNewMovie(createMovieDto);

    return movie;
  }

  @Delete('/:id')
  public async deleteMovie(
    @Param('id', ParseIntPipe) movieId: number,
  ): Promise<{ message: string }> {
    await this.movieService.deleteMovie(movieId);

    return {
      message: 'OK',
    };
  }
}
