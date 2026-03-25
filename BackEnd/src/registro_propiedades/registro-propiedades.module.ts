import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyFuenteDatos } from './data/fuentes-datos/property.fuente-datos.js';
import { LegalDocFuenteDatos } from './data/fuentes-datos/legal-doc.fuente-datos.js';
import { LegalTrackingStepFuenteDatos } from './data/fuentes-datos/legal-tracking-step.fuente-datos.js';
import { PropertyRepositoryImpl } from './data/repositorios/property.repository-impl.js';
import { CreatePropertyUseCase } from './domain/use-cases/create-property.use-case.js';
import { GetAllPropertiesUseCase } from './domain/use-cases/get-all-properties.use-case.js';
import { GetPropertyByIdUseCase } from './domain/use-cases/get-property-by-id.use-case.js';
import { PropertyController } from './presentation/controllers/property.controller.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PropertyFuenteDatos,
            LegalDocFuenteDatos,
            LegalTrackingStepFuenteDatos,
        ]),
    ],
    controllers: [PropertyController],
    providers: [
        /**
         * Registramos los casos de uso como proveedores.
         */
        CreatePropertyUseCase,
        GetAllPropertiesUseCase,
        GetPropertyByIdUseCase,
        /**
         * Registramos el repositorio usando el token de la clase abstracta.
         */
        {
            provide: 'PropertyRepository',
            useClass: PropertyRepositoryImpl,
        },
    ],
})
export class RegistroPropiedadesModule { }
