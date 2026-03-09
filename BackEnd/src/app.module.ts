import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapaConstructorModule } from './mapa_constructor/mapa_constructor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.fuente-datos{.ts,.js}'],
      synchronize: true,
    }),
    MapaConstructorModule,
  ],
})
export class AppModule {}
