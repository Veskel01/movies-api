import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemoryDatabaseModule } from './database/memory-database/memory-database.module';
import { RouterModules } from './modules';

@Module({
  imports: [
    ...RouterModules,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MemoryDatabaseModule.forRoot({
      pathToFile: `${process.cwd()}/data/db-impl.json`,
      removeOnShutdown: true,
    }),
  ],
})
export class AppModule {}
