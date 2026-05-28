import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MapaConstructorModule } from './mapa_constructor/mapa_constructor.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { RegistroPropiedadesModule } from './registro_propiedades/registro-propiedades.module';
import { CalculosModule } from './calculos/calculos.module.js';
import { TrazabilidadModule } from './trazabilidad/trazabilidad.module';
import { OrquestacionModule } from './orquestacion/orquestacion.module';
import { SociosModule } from './socios/socios.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { InversionesModule } from './inversiones/inversiones.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.fuente-datos{.ts,.js}'],
        autoLoadEntities: true,
        // Forzamos temporalmente la sincronización automática para poblar Render
        synchronize: true,
        // Pool de conexiones: evita que pg reutilice el mismo cliente para queries concurrentes
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
          max: 10,        // máximo de conexiones en el pool
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),
    MapaConstructorModule,
    AutenticacionModule,
    RegistroPropiedadesModule,
    CalculosModule,
    TrazabilidadModule,
    OrquestacionModule,
    SociosModule,
    ProyectosModule,
    InversionesModule,
  ],
})
export class AppModule { }