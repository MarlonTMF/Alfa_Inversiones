import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultimediaControlador } from './presentation/controladores/multimedia.controlador.js';
import { ImageKitService } from '../../imagekit.service.js';
import { CloudinaryService } from '../../cloudinary.service.js';
import { PropertyRepository } from './domain/interfaces/property.repository.js';
import { PropertyRepositoryImpl } from './data/repositorios/property.repository-impl.js';
import { PropertyFuenteDatos } from './data/fuentes-datos/property.fuente-datos.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([PropertyFuenteDatos])
    ],
    controllers: [MultimediaControlador],
    providers: [
        ImageKitService,
        CloudinaryService,
        {
            provide: PropertyRepository,
            useClass: PropertyRepositoryImpl,
        },
    ],
})
export class MultimediaModule {}