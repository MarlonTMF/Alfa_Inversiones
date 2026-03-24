import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MapaConstructorModule } from './mapa_constructor/mapa_constructor.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { CalculosModule } from './calculos/calculos.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}', __dirname + '/**/*.fuente-datos{.ts,.js}'],
      synchronize: false,
    }),
    MapaConstructorModule,
    AutenticacionModule,
    CalculosModule,
  ],
})
export class AppModule { }
