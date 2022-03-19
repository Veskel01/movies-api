import * as fs from 'fs';
import { Collection } from './collection';
import { v4 as uuid } from 'uuid';
import { IdType } from '../interfaces';
import { DateTime } from 'luxon';
import {
  AdditionalEntityData,
  DbCollectionsType,
  SingleDbCollection,
} from '../interfaces/memory-database.interface';

export class MemoryDatabase {
  private _pathToFile: string;

  private _dbCollections: DbCollectionsType<unknown> = new Map();

  constructor(pathToFile: string) {
    this._pathToFile = pathToFile;
    this._prepareDatabase(pathToFile);
  }

  public getCollection<K extends string | number, T>(
    collectionName: string,
    idType: IdType,
  ): Collection<K, T> {
    const collections = [...this._dbCollections.keys()];

    if (!collections.includes(collectionName)) {
      this._dbCollections.set(collectionName, []);

      return new Collection<K, T>(collectionName, this, idType);
    }

    return new Collection<K, T>(collectionName, this, idType);
  }

  public getCollectionData<T>(collectionName: string): SingleDbCollection<T> {
    const collectionData = this._dbCollections.get(
      collectionName,
    ) as SingleDbCollection<T>;

    return collectionData as SingleDbCollection<T>;
  }

  public async insert<K extends string | number, T extends Partial<{ id: K }>>(
    idType: IdType,
    collectionName: string,
    data: T,
  ): Promise<{ id: K; additionalData: AdditionalEntityData }> {
    let collection = this._dbCollections.get(collectionName);

    if (!collection) {
      collection = await this._createNewCollection(collectionName);
    }

    let id: string | number | null = data.id || null;

    if (!id) {
      id = this._generateId(collection, idType);
    }

    try {
      const collections = this._getDbCollections();

      if (!collections[collectionName]) {
        await this._createNewCollection(collectionName);
        const { id, additionalData } = await this.insert(
          idType,
          collectionName,
          data,
        );

        return {
          id: id as K,
          additionalData,
        };
      }

      const existingValueIndex = (collections[collectionName] || []).findIndex(
        (item) => item.id === id,
      );

      if (existingValueIndex === -1) {
        const currentDate = DateTime.now().toJSDate();

        const additionalData = {
          createdAt: currentDate,
          updatedAt: currentDate,
        };

        collections[collectionName].push({
          id,
          data,
          additionalData,
        });

        await this.writeToDb(collections);
        return {
          id: id as K,
          additionalData,
        };
      }

      collections[collectionName][existingValueIndex] = {
        ...collections[collectionName][existingValueIndex],
        data,
        additionalData: {
          ...collections[collectionName][existingValueIndex].additionalData,
          updatedAt: DateTime.now().toJSDate(),
        },
      };

      await this.writeToDb(collections);

      return {
        id: id as K,
        additionalData: {
          ...collections[collectionName][existingValueIndex].additionalData,
        },
      };
    } catch (err) {
      const error = err as Error & { errno: number };

      if (error.errno === -4058) {
        this._prepareDatabase(this._pathToFile);

        const { id, additionalData } = await this.insert(
          idType,
          collectionName,
          data,
        );

        return {
          id: id as K,
          additionalData,
        };
      }

      throw this._getFileException();
    }
  }

  public async delete(
    id: string | number,
    collectionName: string,
  ): Promise<{ deletedId: string | number | null }> {
    const collection = this._dbCollections.get(collectionName);

    if (!collection) {
      return {
        deletedId: null,
      };
    }

    const indexToDelete = collection.findIndex((item) => item.id === id);

    if (indexToDelete !== -1) {
      collection.splice(indexToDelete, 1);

      const allCollections = this._getDbCollections();

      const singleCollection = Object.entries(allCollections).find(
        ([key]) => key === collectionName,
      );

      if (!singleCollection) {
        throw this._getCollectionNotExistException();
      }

      const [{ id }] = singleCollection[1].splice(indexToDelete, 1);

      await this.writeToDb(allCollections);

      return {
        deletedId: id,
      };
    }

    return {
      deletedId: null,
    };
  }

  private _prepareDatabase(pathToFile: string): void {
    if (!fs.existsSync(pathToFile)) {
      return fs.writeFile(pathToFile, JSON.stringify({}), 'utf-8', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    this._getDbCollections();
  }

  private _generateId(
    collection: SingleDbCollection<unknown>,
    idType: IdType,
  ): string | number {
    if (idType === 'increment') {
      let id = collection.length;
      if (id < 0 || id === 0) {
        id = 0;
      }

      return (id += 1);
    }

    return uuid();
  }

  private async writeToDb(dataToInsert: unknown): Promise<void> {
    await fs.promises.writeFile(
      this._pathToFile,
      JSON.stringify(dataToInsert, null, 4),
    );

    this._getDbCollections();
  }

  private _getDbCollections(): Record<string, SingleDbCollection<unknown>> {
    const readJsonResult = fs.readFileSync(this._pathToFile, 'utf-8');

    if (readJsonResult.length === 0) {
      return {};
    }

    const collections = JSON.parse(readJsonResult) as Record<
      string,
      Array<{ id: string | number; data: unknown }>
    >;

    Object.entries(collections).forEach(([key, value]) => {
      this._dbCollections.set(key, value);
    });

    return collections;
  }

  private async _createNewCollection(
    collectionName: string,
  ): Promise<SingleDbCollection<unknown>> {
    const collectionStructure = {
      [collectionName]: [],
    };

    await this.writeToDb(collectionStructure);

    return collectionStructure as unknown as SingleDbCollection<unknown>;
  }

  private _getFileException(): Error {
    return new Error('Failed to store data in memory');
  }

  private _getCollectionNotExistException(): Error {
    return new Error('The specified collection does not exist');
  }
}
