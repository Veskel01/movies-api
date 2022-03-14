import { Provider } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MovieRepositoryProvider } from './providers/movies-repository.provider';

type Keys = 'movie';

type SingleProvider = {
  key: Keys;
  provider: Provider;
};

const repositoryProviders: SingleProvider[] = [
  {
    key: 'movie',
    provider: MovieRepositoryProvider,
  },
];

@Module({})
export class RepositoryModule {
  static forRepositories(keys: Keys[] | 'all'): DynamicModule {
    if (keys === 'all') {
      const providers = repositoryProviders.map(({ provider }) => provider);

      return {
        module: RepositoryModule,
        providers,
        exports: providers,
      };
    }

    const providers = repositoryProviders
      .filter(({ key }) => keys.includes(key))
      .map(({ provider }) => provider);

    return {
      module: RepositoryModule,
      providers,
      exports: providers,
    };
  }
}
