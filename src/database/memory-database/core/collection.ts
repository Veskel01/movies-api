import { IdType } from '../interfaces';
import { MemoryDatabase } from './memory-database';

type WithId<T, K> = T & { id: K };

export class Collection<K extends string | number, T> {
  private readonly _collectionName: string;

  private _db: MemoryDatabase;

  private _idType: IdType;

  constructor(collectionName: string, db: MemoryDatabase, idType: IdType) {
    this._collectionName = collectionName;

    this._db = db;

    this._idType = idType;
  }

  public findAll(config: { withId?: boolean }): Array<T | WithId<T, K>> {
    const result = this._db.getCollectionData<T>(this._collectionName);

    if (config.withId) {
      return result.map(({ id, data }) => {
        return {
          ...data,
          id,
        };
      });
    }

    return result.map(({ data }) => data);
  }

  public findById(id: K): WithId<T, K> {
    const result = this._db.getCollectionData<T>(this._collectionName);

    const findResult = result.find((item) => item.id === id);

    if (!findResult) {
      throw this.getNotFoundException();
    }
    const { data } = findResult;

    return {
      ...data,
      id,
    };
  }

  public async create(data: T): Promise<T> {
    const model = await this.insert(data);

    return model;
  }

  public async insert(data: T): Promise<T> {
    const { id, additionalData } = await this._db.insert<K, T>(
      this._idType,
      this._collectionName,
      data,
    );

    return {
      ...data,
      id,
      additionalData,
    };
  }

  public async delete(id: K): Promise<{ deleted: boolean }> {
    const result = await this._db.delete(id, this._collectionName);

    if (!result) {
      return {
        deleted: false,
      };
    }

    return {
      deleted: true,
    };
  }

  public count(): number {
    return this._db.getCollectionData(this._collectionName).length;
  }

  // private _loadDataToMemory(): void {
  //   const readJsonResult = fs.readFileSync(
  //     `${process.cwd()}/data/db.json`,
  //     'utf-8',
  //   );

  //   const { movies } = JSON.parse(readJsonResult) as SeedData;

  //   this._dbCollections.set(MemoryDbCollections.MOVIES, new Map());

  //   movies.forEach((movieDto) => {
  //     this._dbCollections
  //       .get(MemoryDbCollections.MOVIES)
  //       .set(movieDto.id, movieDto);
  //   });
  // }

  private getNotFoundException(): Error {
    return new Error('Entity not found');
  }
}
