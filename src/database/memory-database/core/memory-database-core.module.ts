import * as fs from 'fs';
import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { MemoryDatabase } from './memory-database';
import { getInstanceToken } from '../common';
import {
  MemoryDatabaseModuleAsyncOptions,
  MemoryDatabaseModuleOptions,
  MemoryDatabaseOptionsFactory,
} from '../interfaces';
import { MEMORY_DB_MODULE_OPTIONS } from '../constants';

@Global()
@Module({})
export class MemoryDatabaseCoreModule implements OnApplicationShutdown {
  constructor(
    @Inject(MEMORY_DB_MODULE_OPTIONS)
    private readonly options: MemoryDatabaseModuleOptions,
  ) {}

  public async onApplicationShutdown(): Promise<void> {
    if (this.options.removeOnShutdown) {
      await fs.promises.unlink(this.options.pathToFile);
    }
  }

  static forRoot(options: MemoryDatabaseModuleOptions): DynamicModule {
    const { pathToFile, databaseKey } = options;

    const optionsProvider: Provider<MemoryDatabaseModuleOptions> = {
      provide: MEMORY_DB_MODULE_OPTIONS,
      useValue: options,
    };

    const instanceProvider: Provider = {
      provide: getInstanceToken(databaseKey),
      useFactory: () => {
        const instance = new MemoryDatabase(pathToFile);

        return instance;
      },
    };

    return {
      module: MemoryDatabaseCoreModule,
      providers: [instanceProvider, optionsProvider],
      exports: [instanceProvider],
    };
  }

  static forRootAsync(
    options: MemoryDatabaseModuleAsyncOptions,
  ): DynamicModule {
    const { databaseKey } = options;

    const instanceProvider: Provider = {
      provide: getInstanceToken(databaseKey),
      useFactory: (factoryOptions: MemoryDatabaseModuleOptions) => {
        const { pathToFile } = factoryOptions;

        const instance = new MemoryDatabase(pathToFile);

        return instance;
      },
      inject: [MEMORY_DB_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MemoryDatabaseCoreModule,
      providers: [instanceProvider, ...asyncProviders],
      exports: [instanceProvider],
    };
  }

  private static createAsyncProviders(
    options: MemoryDatabaseModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<MemoryDatabaseModuleAsyncOptions>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: MemoryDatabaseModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MEMORY_DB_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [options.useClass || options.useExisting] as [
      Type<MemoryDatabaseOptionsFactory>,
    ];

    return {
      provide: MEMORY_DB_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: MemoryDatabaseOptionsFactory,
      ): Promise<MemoryDatabaseModuleOptions> =>
        await optionsFactory.createMemoryDatabaseOptions(options.databaseKey),
      inject,
    };
  }
}
