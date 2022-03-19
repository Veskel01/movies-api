import { Provider } from '@nestjs/common';
import { getCollectionToken, getInstanceToken } from './common';
import { DEFAULT_DATABASE_KEY } from './constants';
import { Collection, MemoryDatabase } from './core';
import { IdType, MemoryDbEntity } from './interfaces';

export const createMemoryDbProviders = (
  entities: MemoryDbEntity[],
  databaseKey: string = DEFAULT_DATABASE_KEY,
  idType: IdType,
): Provider[] => {
  return (entities || []).map((entity) => {
    return {
      provide: getCollectionToken(entity, databaseKey),
      useFactory: (
        instance: MemoryDatabase,
      ): Collection<string | number, unknown> => {
        return instance.getCollection(entity.name, idType);
      },
      inject: [getInstanceToken(databaseKey)],
    };
  });
};
