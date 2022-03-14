export abstract class BaseRepository<T, U, ID extends string | number> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T | null>;
  abstract create(data: Partial<U>): T;
  abstract save(model: T): Promise<T>;
  abstract delete(model: T): Promise<void>;
}
