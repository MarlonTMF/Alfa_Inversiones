import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyFuenteDatos } from './data/fuentes-datos/property.fuente-datos.js';
import { LegalDocFuenteDatos } from './data/fuentes-datos/legal-doc.fuente-datos.js';
import { LegalTrackingStepFuenteDatos } from './data/fuentes-datos/legal-tracking-step.fuente-datos.js';
import { PropertyRepositoryImpl } from './data/repositorios/property.repository-impl.js';
import { CreatePropertyUseCase } from './domain/use-cases/create-property.use-case.js';
import { GetAllPropertiesUseCase } from './domain/use-cases/get-all-properties.use-case.js';
import { GetPropertyByIdUseCase } from './domain/use-cases/get-property-by-id.use-case.js';
import { GetPropertyAnalysisUseCase } from './domain/use-cases/get-property-analysis.use-case.js';
import { UpdatePropertyUseCase } from './domain/use-cases/update-property.use-case.js';
import { PropertyController } from './presentation/controllers/property.controller.js';
import { MultimediaControlador } from './data/repositorios/multimedia.controlador.js';
import { ImageKitService } from '../common/services/imagekit.service.js';
import { CloudinaryService } from '../common/services/cloudinary.service.js';
import { PropertyRepository } from './domain/interfaces/property.repository.js';
import { RegisterFullPropertyUseCase } from './domain/use-cases/register-full-property.use-case.js';
import { AutenticacionModule } from '../autenticacion/autenticacion.module.js';

// Entidades de Datos
import { PropertyMultimediaFuenteDatos } from './data/fuentes-datos/property-multimedia.fuente-datos.js';
// Repositorios e Implementación
import { PropertyMultimediaRepository } from './domain/repositories/property-multimedia.repository.js';
import { PropertyMultimediaRepositoryImpl } from './data/repositorios/property-multimedia.repository-impl.js';
// Servicios de Infraestructura
import { FileStorageService } from './domain/services/file-storage.service.js';
import { HybridFileStorageService } from './infrastructure/storage/hybrid-file-storage.service.js';
// Casos de Uso
import { AddPropertyMultimediaUseCase } from './domain/use-cases/add-property-multimedia.use-case.js';
import { GetPropertyMultimediaUseCase } from './domain/use-cases/get-property-multimedia.use-case.js';
import { DeletePropertyMultimediaUseCase } from './domain/use-cases/delete-property-multimedia.use-case.js';
import { SetMainMultimediaUseCase } from './domain/use-cases/set-main-multimedia.use-case.js';

// ... (tus imports están perfectos)

@Module({
  imports: [
    AutenticacionModule,
    TypeOrmModule.forFeature([
      PropertyFuenteDatos,
      PropertyMultimediaFuenteDatos, // <-- Añadido correctamente
      LegalDocFuenteDatos,
      LegalTrackingStepFuenteDatos,
    ]),
  ],
  controllers: [PropertyController, MultimediaControlador], // Registro del nuevo controlador
  providers: [
    // 1. Registro de los Casos de Uso Originales
    CreatePropertyUseCase,
    GetAllPropertiesUseCase,
    GetPropertyByIdUseCase,
    GetPropertyAnalysisUseCase,
    UpdatePropertyUseCase,

    // 2. Registro de tus NUEVOS Casos de Uso Multimedia
    AddPropertyMultimediaUseCase,
    GetPropertyMultimediaUseCase,
    DeletePropertyMultimediaUseCase,
    SetMainMultimediaUseCase,
    ImageKitService,
    CloudinaryService,

    // 3. Registro del Repositorio de Terrenos (Estilo actual)
    {
      provide: 'PropertyRepository', // Mantenemos el string para los Casos de Uso viejos
      useClass: PropertyRepositoryImpl,
    },
    {
      provide: PropertyRepository, // Añadimos la clase para el nuevo controlador
      useExisting: 'PropertyRepository', // Hacemos un alias para que sea la misma instancia
    },

    // 4. Registro de tu NUEVO Repositorio Multimedia (Estilo Clean Architecture)
    {
      provide: PropertyMultimediaRepository,
      useClass: PropertyMultimediaRepositoryImpl,
    },

    // 5. Registro de tu NUEVO Servicio de Almacenamiento
    {
      provide: FileStorageService,
      useClass: HybridFileStorageService,
    },
    RegisterFullPropertyUseCase,
  ],
})
export class RegistroPropiedadesModule {}
