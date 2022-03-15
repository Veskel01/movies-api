import * as fs from 'fs';
import { MemoryDbCollections, SeedData } from '../shared_types';
import { v4 as uuid } from 'uuid';

export class MemoryDatabase {
  private static instance: MemoryDatabase;

  private readonly _filePath: string = `${process.cwd()}/data/db.json`;

  private _collections: Map<string, Map<string | number, unknown>> = new Map();

  private constructor() {}

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      const instance = new MemoryDatabase();

      instance.loadDataToMemory();

      MemoryDatabase.instance = instance;

      return instance;
    }

    return MemoryDatabase.instance;
  }

  public getCollection<K extends string | number, T>(
    collectionName: string,
  ): Map<K, T> {
    return this._collections.get(collectionName) as Map<K, T>;
  }

  public createCollection<T>(collectionName: string): Map<string | number, T> {
    this._collections.set(collectionName, new Map<string | number, T>());

    return this._collections.get(collectionName) as Map<string | number, T>;
  }

  public async insert<K extends string | number, T extends Partial<{ id: K }>>(
    collectionName: string,
    data: T,
  ): Promise<K> {
    const collection = this._collections.get(collectionName);

    let id: string | number = data.id || null;

    if (!id) {
      id = this.generateId(collection);
    }

    const newItem = {
      ...data,
      id,
    };

    collection.set(id, newItem);

    const collections = this.getDbCollections();

    collections[collectionName].push(newItem as unknown);

    await this.writeToDb(collections);

    return id as K;
  }

  public async delete(
    id: string | number,
    collectionName: string,
  ): Promise<void> {
    const collection = this._collections.get(collectionName);

    collection.delete(id);

    const allCollections = this.getDbCollections();

    await this.writeToDb(allCollections);
  }

  private loadDataToMemory(): void {
    const readJsonResult = fs.readFileSync(this._filePath, 'utf-8');

    const { movies } = JSON.parse(readJsonResult) as SeedData;

    this._collections.set(MemoryDbCollections.MOVIES, new Map());

    movies.forEach((movieDto) => {
      this._collections
        .get(MemoryDbCollections.MOVIES)
        .set(movieDto.id, movieDto);
    });

    // console.log(
    //   `Load data to memory: ${
    //     this.getCollection(MemoryDbCollections.MOVIES).size
    //   } - items loaded`,
    // );
  }

  private generateId(
    collection: Map<number | string, unknown>,
  ): string | number {
    const [collectionFirstKey] = collection.keys();

    if (typeof collectionFirstKey === 'number') {
      let id = collection.size;
      if (id < 0) {
        id = 0;
      }
      return (id += 1);
    }

    return uuid();
  }

  private async writeToDb(dataToInsert: unknown): Promise<void> {
    await fs.promises.writeFile(
      this._filePath,
      JSON.stringify(dataToInsert, null, 4),
    );
  }

  private getDbCollections(): SeedData {
    const readJsonResult = fs.readFileSync(this._filePath, 'utf-8');

    return JSON.parse(readJsonResult) as SeedData;
  }
}
