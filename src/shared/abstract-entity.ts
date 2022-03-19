import { AdditionalEntityData } from '../database/memory-database/interfaces/memory-database.interface';

export abstract class AbstractEntity<K extends string | number> {
  public id: K;

  public additionalData: AdditionalEntityData;
}
