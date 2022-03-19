import { DEFAULT_DATABASE_KEY } from '../constants';
import { MemoryDbEntity } from '../interfaces';

export const getInstanceToken = (
  databaseKey: string = DEFAULT_DATABASE_KEY,
): string => `memory-db-instance:${databaseKey}`;

export const getCollectionToken = (
  entity: MemoryDbEntity,
  databaseKey: string = DEFAULT_DATABASE_KEY,
): string => `${databaseKey}-memory-db-collection:${entity.name}`;
