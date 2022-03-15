import { MemoryDbCollections } from './collections';
import { MovieDTO } from './movie-dto.interface';

export interface SeedData {
  [MemoryDbCollections.MOVIES]: MovieDTO[];
}
