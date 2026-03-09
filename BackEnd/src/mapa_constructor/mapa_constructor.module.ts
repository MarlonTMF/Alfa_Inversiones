import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Data
import { TerrenoFuenteDatos } from './data/fuentes-datos/terreno.fuente-datos.js';
import { TerrenoRepositorioImpl } from './data/repositorios/terreno.repositorio-impl.js';

// Domain
import { TERRENO_REPOSITORIO } from './domain/interfaces/terreno.repositorio.js';
import { ObtenerTerrenosCasoUso } from './domain/casos-uso/obtener-terrenos.caso-uso.js';

// Presentation
import { TerrenosControlador } from './presentation/controladores/terrenos.controlador.js';

@Module({
  imports: [TypeOrmModule.forFeature([TerrenoFuenteDatos])],
  controllers: [TerrenosControlador],
  providers: [
    {
      provide: TERRENO_REPOSITORIO,
      useClass: TerrenoRepositorioImpl,
    },
    ObtenerTerrenosCasoUso,
  ],
})
export class MapaConstructorModule implements OnModuleInit {
  constructor(
    @InjectRepository(TerrenoFuenteDatos)
    private readonly terrenoRepo: Repository<TerrenoFuenteDatos>,
  ) {}

  async onModuleInit() {
    const count = await this.terrenoRepo.count();
    if (count === 0) {
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
  }
}
