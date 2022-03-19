import { Inject } from '@nestjs/common';
import { DEFAULT_DATABASE_KEY } from '../constants';
import { getCollectionToken, getInstanceToken } from './utils';

export const InjectCollection = (
  entity: new (...args: unknown[]) => unknown,
  databaseKey: string = DEFAULT_DATABASE_KEY,
): ReturnType<typeof Inject> => Inject(getCollectionToken(entity, databaseKey));

export const InjectInstance = (
  databaseKey?: string,
): ReturnType<typeof Inject> => Inject(getInstanceToken(databaseKey));
