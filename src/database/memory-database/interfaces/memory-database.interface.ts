export interface AdditionalEntityData {
  createdAt?: Date;
  updatedAt?: Date;
}

export type SingleDbCollection<T> = Array<{
  id: string | number;
  data: T;
  additionalData?: AdditionalEntityData;
}>;

export type DbCollectionsType<T> = Map<string, SingleDbCollection<T>>;
