import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyFuenteDatos } from './data/fuentes-datos/property.fuente-datos.js';
import { LegalDocFuenteDatos } from './data/fuentes-datos/legal-doc.fuente-datos.js';
import { LegalTrackingStepFuenteDatos } from './data/fuentes-datos/legal-tracking-step.fuente-datos.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PropertyFuenteDatos,
            LegalDocFuenteDatos,
            LegalTrackingStepFuenteDatos,
        ]),
    ],
    controllers: [],
    providers: [],
})
export class RegistroPropiedadesModule { }
