import { DynamicModule, Module } from '@nestjs/common';
import { DEFAULT_DATABASE_KEY } from './constants';
import { MemoryDatabaseCoreModule } from './core';
import {
  MemoryDatabaseForFeatureOptions,
  MemoryDatabaseModuleOptions,
  MemoryDatabaseModuleAsyncOptions,
} from './interfaces';
import { createMemoryDbProviders } from './memory-db.providers';

@Module({})
export class MemoryDatabaseModule {
  static forRoot(options: MemoryDatabaseModuleOptions): DynamicModule {
    return {
      module: MemoryDatabaseModule,
      imports: [
        MemoryDatabaseCoreModule.forRoot({
          ...options,
          databaseKey: options.databaseKey || DEFAULT_DATABASE_KEY,
        }),
      ],
    };
  }

  static forRootAsync(
    options: MemoryDatabaseModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: MemoryDatabaseModule,
      imports: [
        MemoryDatabaseCoreModule.forRootAsync({
          ...options,
          databaseKey: options.databaseKey || DEFAULT_DATABASE_KEY,
        }),
      ],
    };
  }

  static forFeature(options: MemoryDatabaseForFeatureOptions): DynamicModule {
    const { entities, connection, idType } = options;

    const providers = createMemoryDbProviders(entities, connection, idType);

    return {
      module: MemoryDatabaseModule,
      providers,
      exports: providers,
    };
  }
}
