import { DEFAULT_DATABASE_KEY } from '../constants';

export const getInstanceToken = (
  databaseKey: string = DEFAULT_DATABASE_KEY,
): string => `memory-db-instance:${databaseKey}`;

export const getCollectionToken = (
  entity: string | (new (...args: unknown[]) => unknown),
  databaseKey: string = DEFAULT_DATABASE_KEY,
): string =>
  `${databaseKey}-memory-db-collection:${
    typeof entity === 'string' ? entity : entity.name
  }`;
