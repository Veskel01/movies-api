import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemoryDatabase } from './database/memory-database';
import { RouterModules } from './modules';

@Module({
  imports: [
    ...RouterModules,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {
  // For db data initializtaion
  constructor() {
    MemoryDatabase.getInstance();
  }
}
