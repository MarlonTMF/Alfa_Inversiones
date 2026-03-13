import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MapaConstructorModule } from './mapa_constructor/mapa_constructor.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';

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
        synchronize: false, // Desactivado para respetar tu script manual
        autoLoadEntities: true,
      }),
    }),
    MapaConstructorModule,
    AutenticacionModule,
  ],
})
export class AppModule { }
