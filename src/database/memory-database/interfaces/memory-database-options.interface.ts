import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export type IdType = 'increment' | 'uuid';

export interface MemoryDatabaseModuleOptions {
  databaseKey?: string;
  pathToFile: string;
  removeOnShutdown?: boolean;
}

export interface MemoryDatabaseOptionsFactory {
  createMemoryDatabaseOptions(
    databaseKey?: string,
  ): Promise<MemoryDatabaseModuleOptions> | MemoryDatabaseModuleOptions;
}

export interface MemoryDatabaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  databaseKey?: string;
  useExisting?: Type<MemoryDatabaseOptionsFactory>;
  useClass?: Type<MemoryDatabaseOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<MemoryDatabaseModuleOptions> | MemoryDatabaseModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}
