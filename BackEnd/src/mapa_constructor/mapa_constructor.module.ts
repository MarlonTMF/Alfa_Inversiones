import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Data
import { PropertyFuenteDatos } from '../registro_propiedades/data/fuentes-datos/property.fuente-datos.js';
import { TerrenoRepositorioImpl } from './data/repositorios/terreno.repositorio-impl.js';
import { AmenidadFuenteDatos } from './data/fuentes-datos/amenidad.fuente-datos.js';
import { AmenidadRepositorioImpl } from './data/repositorios/amenidad.repositorio-impl.js';

// Domain
import { TERRENO_REPOSITORIO } from './domain/interfaces/terreno.repositorio.js';
import { ObtenerTerrenosCasoUso } from './domain/casos-uso/obtener-terrenos.caso-uso.js';
import { CrearTerrenoCasoUso } from './domain/casos-uso/crear-terreno.caso-uso.js';
import { AMENIDAD_REPOSITORIO } from './domain/interfaces/amenidad.repositorio.js';
import { ObtenerAmenidadesCasoUso } from './domain/casos-uso/obtener-amenidades.caso-uso.js';

// Presentation
import { TerrenosControlador } from './presentation/controladores/terrenos.controlador.js';
import { AmenidadesControlador } from './presentation/controladores/amenidades.controlador.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyFuenteDatos, AmenidadFuenteDatos]),
  ],
  controllers: [TerrenosControlador, AmenidadesControlador],
  providers: [
    {
      provide: TERRENO_REPOSITORIO,
      useClass: TerrenoRepositorioImpl,
    },
    {
      provide: AMENIDAD_REPOSITORIO,
      useClass: AmenidadRepositorioImpl,
    },
    ObtenerTerrenosCasoUso,
    CrearTerrenoCasoUso,
    ObtenerAmenidadesCasoUso,
  ],
})
export class MapaConstructorModule {
  // Ya no usamos semilla automática aquí para respetar el script SQL manual del usuario
}
