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
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'Marlon22'),
        database: configService.get<string>('DB_NAME', 'db_inmobiliaria'),
        entities: [__dirname + '/**/*.fuente-datos{.ts,.js}'],
        synchronize: false, // Desactivado para manejar la migración manualmente en el script de seed
        autoLoadEntities: true,
      }),
    }),
    MapaConstructorModule,
    AutenticacionModule,
    RegistroPropiedadesModule,
    CalculosModule,
    TrazabilidadModule,
    OrquestacionModule,
    SociosModule,
  ],
})
export class AppModule { }
