import { Test, TestingModule } from '@nestjs/testing';
import { MemoryDatabase } from '../../../src/database';
import { MoviesController, MoviesService } from '../../../src/modules/movies';
import { CreateMovieDTO } from '../../../src/modules/movies/dto/create-movie.dto';
import { RepositoryModule } from '../../../src/repositories';
import { Genres } from '../../../src/shared_types';

describe('Movies Controller', () => {
  let db: MemoryDatabase;
  let moviesController: MoviesController;

  before(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule.forRepositories(['movie'])],
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    moviesController = app.get(MoviesController);
  });

  describe('methods', () => {
    const dataToCreate: CreateMovieDTO = {
      title: 'Black Swan',
      year: 2010,
      runtime: 108,
      genres: [Genres.DRAMA, Genres.THRILLER],
      director: 'Darren Aronofsky',
      actors: 'Natalie Portman, Mila Kunis, Vincent Cassel, Barbara Hershey',
      plot: 'A committed dancer wins the lead role in a production of Tchaikovsky\'s "Swan Lake" only to find herself struggling to maintain her sanity.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BNzY2NzI4OTE5MF5BMl5BanBnXkFtZTcwMjMyNDY4Mw@@._V1_SX300.jpg',
    };

    describe('create', () => {
      it('should create new movie with id', () => {
        console.log('test');
      });
    });
  });
});
