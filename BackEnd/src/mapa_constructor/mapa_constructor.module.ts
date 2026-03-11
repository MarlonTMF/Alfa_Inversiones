import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Data
import { TerrenoFuenteDatos } from './data/fuentes-datos/terreno.fuente-datos.js';
import { TerrenoRepositorioImpl } from './data/repositorios/terreno.repositorio-impl.js';
import { AmenidadFuenteDatos } from './data/fuentes-datos/amenidad.fuente-datos.js';
import { AmenidadRepositorioImpl } from './data/repositorios/amenidad.repositorio-impl.js';

// Domain
import { TERRENO_REPOSITORIO } from './domain/interfaces/terreno.repositorio.js';
import { ObtenerTerrenosCasoUso } from './domain/casos-uso/obtener-terrenos.caso-uso.js';
import { AMENIDAD_REPOSITORIO } from './domain/interfaces/amenidad.repositorio.js';
import { ObtenerAmenidadesCasoUso } from './domain/casos-uso/obtener-amenidades.caso-uso.js';

// Presentation
import { TerrenosControlador } from './presentation/controladores/terrenos.controlador.js';
import { AmenidadesControlador } from './presentation/controladores/amenidades.controlador.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TerrenoFuenteDatos, AmenidadFuenteDatos]),
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
    ObtenerAmenidadesCasoUso,
  ],
})
export class MapaConstructorModule implements OnModuleInit {
  constructor(
    @InjectRepository(TerrenoFuenteDatos)
    private readonly terrenoRepo: Repository<TerrenoFuenteDatos>,
    @InjectRepository(AmenidadFuenteDatos)
    private readonly amenidadRepo: Repository<AmenidadFuenteDatos>,
  ) {}

  async onModuleInit() {
    const terrenoCount = await this.terrenoRepo.count();
    if (terrenoCount === 0) {
      await this.terrenoRepo.save([
        {
          id: 'TER-001',
          ubicacion: 'Zona Norte, Av. América',
          precio: 1200000,
          superficie: 1500,
          poligono_json: JSON.stringify([
            [-17.375, -66.1575],
            [-17.375, -66.156],
            [-17.3765, -66.156],
            [-17.3765, -66.1575],
          ]),
        },
        {
          id: 'TER-002',
          ubicacion: 'Zona Sur, Calle Baptista',
          precio: 850000,
          superficie: 800,
          poligono_json: JSON.stringify([
            [-17.41, -66.155],
            [-17.41, -66.153],
            [-17.412, -66.153],
            [-17.412, -66.155],
          ]),
        },
        {
          id: 'TER-003',
          ubicacion: 'Tiquipaya, Av. Ecológica',
          precio: 450000,
          superficie: 2000,
          poligono_json: JSON.stringify([
            [-17.34, -66.215],
            [-17.34, -66.212],
            [-17.342, -66.212],
            [-17.342, -66.215],
          ]),
        },
        {
          id: 'TER-004',
          ubicacion: 'Sacaba, Zona Central',
          precio: 320000,
          superficie: 600,
          poligono_json: JSON.stringify([
            [-17.395, -66.04],
            [-17.395, -66.038],
            [-17.397, -66.038],
            [-17.397, -66.04],
          ]),
        },
      ]);
      console.log('✅ Datos semilla de terrenos insertados');
    }

    const amenidadCount = await this.amenidadRepo.count();
    if (amenidadCount === 0) {
      await this.amenidadRepo.save([
        {
          id: 'AME-001',
          nombre: 'Mercado Calatayud',
          tipo: 'mercado',
          lat: -17.3755,
          lng: -66.157,
        },
        {
          id: 'AME-002',
          nombre: 'Mercado La Pampa',
          tipo: 'mercado',
          lat: -17.38,
          lng: -66.16,
        },
        {
          id: 'AME-003',
          nombre: 'Parada Micro 110',
          tipo: 'transporte',
          lat: -17.374,
          lng: -66.1565,
        },
        {
          id: 'AME-004',
          nombre: 'Terminal de Buses',
          tipo: 'transporte',
          lat: -17.393,
          lng: -66.157,
        },
        {
          id: 'AME-005',
          nombre: 'Colegio La Salle',
          tipo: 'colegio',
          lat: -17.376,
          lng: -66.155,
        },
        {
          id: 'AME-006',
          nombre: 'Colegio Don Bosco',
          tipo: 'colegio',
          lat: -17.382,
          lng: -66.158,
        },
        {
          id: 'AME-007',
          nombre: 'Hospital Viedma',
          tipo: 'hospital',
          lat: -17.393,
          lng: -66.151,
        },
        {
          id: 'AME-008',
          nombre: 'Clínica Los Olivos',
          tipo: 'hospital',
          lat: -17.377,
          lng: -66.159,
        },
      ]);
      console.log('✅ Datos semilla de amenidades insertados');
    }
  }
}
