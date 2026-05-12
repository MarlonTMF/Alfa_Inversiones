import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '../orquestacion/guards/admin.guard.js';

import { Proyecto } from './data/fuentes-datos/proyecto.fuente-datos.js';
import { ProyectoFase } from './data/fuentes-datos/proyecto-fase.fuente-datos.js';
import { ProyectoMetrica } from './data/fuentes-datos/proyecto-metrica.fuente-datos.js';
import { ProyectoDocumento } from './data/fuentes-datos/proyecto-documento.fuente-datos.js';
import { ProyectoMultimedia } from './data/fuentes-datos/proyecto-multimedia.fuente-datos.js';
import { ProyectoRepositoryImpl } from './data/repositorios/proyecto.repository-impl.js';

import { PROYECTO_REPOSITORIO } from './domain/interfaces/proyecto.repository.js';
import { CrearProyectoCasoUso } from './domain/use-cases/crear-proyecto.caso-uso.js';
import { GetProyectosCasoUso } from './domain/use-cases/get-proyectos.caso-uso.js';
import { GetProyectoPorIdCasoUso } from './domain/use-cases/get-proyecto-por-id.caso-uso.js';
import { GetProyectosPorEstadoCasoUso } from './domain/use-cases/get-proyectos-por-estado.caso-uso.js';
import { GetProyectoPorPropertyIdCasoUso } from './domain/use-cases/get-proyecto-por-property-id.caso-uso.js';
import { GetProyectosPorConstructorIdCasoUso } from './domain/use-cases/get-proyectos-por-constructor-id.caso-uso.js';
import { GetProyectoDashboardCasoUso } from './domain/use-cases/get-proyecto-dashboard.caso-uso.js';
import { ActualizarProyectoCasoUso } from './domain/use-cases/actualizar-proyecto.caso-uso.js';
import { EliminarProyectoCasoUso } from './domain/use-cases/eliminar-proyecto.caso-uso.js';
import { CrearProyectoFaseCasoUso } from './domain/use-cases/crear-proyecto-fase.caso-uso.js';
import { GetProyectoFasesCasoUso } from './domain/use-cases/get-proyecto-fases.caso-uso.js';
import { CrearProyectoMetricaCasoUso } from './domain/use-cases/crear-proyecto-metrica.caso-uso.js';
import { GetProyectoMetricasCasoUso } from './domain/use-cases/get-proyecto-metricas.caso-uso.js';
import { GetUltimaMetricaCasoUso } from './domain/use-cases/get-ultima-metrica.caso-uso.js';
import { CrearProyectoDocumentoCasoUso } from './domain/use-cases/crear-proyecto-documento.caso-uso.js';
import { GetProyectoDocumentosCasoUso } from './domain/use-cases/get-proyecto-documentos.caso-uso.js';

// Multimedia Use Cases
import { AddProyectoMultimediaCasoUso } from './domain/use-cases/add-proyecto-multimedia.caso-uso.js';
import { GetProyectoMultimediaCasoUso } from './domain/use-cases/get-proyecto-multimedia.caso-uso.js';
import { DeleteProyectoMultimediaCasoUso } from './domain/use-cases/delete-proyecto-multimedia.caso-uso.js';
import { SetMainProyectoMultimediaCasoUso } from './domain/use-cases/set-main-proyecto-multimedia.caso-uso.js';

// Services
import { ImageKitService } from '../common/services/imagekit.service.js';
import { CloudinaryService } from '../common/services/cloudinary.service.js';

import { ProyectosControlador } from './presentation/controllers/proyectos.controlador.js';
import { ProyectoMultimediaControlador } from './presentation/controllers/proyecto-multimedia.controlador.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proyecto,
      ProyectoFase,
      ProyectoMetrica,
      ProyectoDocumento,
      ProyectoMultimedia,
    ]),
  ],
  controllers: [ProyectosControlador, ProyectoMultimediaControlador],
  providers: [
    AdminGuard,
    ImageKitService,
    CloudinaryService,
    {
      provide: PROYECTO_REPOSITORIO,
      useClass: ProyectoRepositoryImpl,
    },
    CrearProyectoCasoUso,
    GetProyectosCasoUso,
    GetProyectoPorIdCasoUso,
    GetProyectosPorEstadoCasoUso,
    GetProyectoPorPropertyIdCasoUso,
    GetProyectosPorConstructorIdCasoUso,
    GetProyectoDashboardCasoUso,
    ActualizarProyectoCasoUso,
    EliminarProyectoCasoUso,
    CrearProyectoFaseCasoUso,
    GetProyectoFasesCasoUso,
    CrearProyectoMetricaCasoUso,
    GetProyectoMetricasCasoUso,
    GetUltimaMetricaCasoUso,
    CrearProyectoDocumentoCasoUso,
    GetProyectoDocumentosCasoUso,
    AddProyectoMultimediaCasoUso,
    GetProyectoMultimediaCasoUso,
    DeleteProyectoMultimediaCasoUso,
    SetMainProyectoMultimediaCasoUso,
  ],
  exports: [PROYECTO_REPOSITORIO],
})
export class ProyectosModule {}
