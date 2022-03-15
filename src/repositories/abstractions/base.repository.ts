export abstract class BaseRepository<T, U, ID extends string | number> {
  abstract findAll(): T[];
  abstract findById(id: ID): T | null;
  abstract create(data: Partial<U>): Promise<T>;
  abstract save(model: T): Promise<T>;
  abstract delete(model: T): Promise<void>;
}
