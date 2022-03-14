import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
export class AppModule {}
