import { MemoryDbEntity } from './entity.type';
import { IdType } from './memory-database-options.interface';

export interface MemoryDatabaseForFeatureOptions {
  entities: MemoryDbEntity[];
  connection?: string;
  idType: IdType;
}
