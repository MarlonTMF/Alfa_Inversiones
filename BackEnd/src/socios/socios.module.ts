import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioFuenteDatos } from './data/fuentes-datos/socio.fuente-datos.js';
import { SociosController } from './presentation/controladores/socios.controlador.js';
import { RegistrarSocioUseCase } from './domain/casos-uso/registrar-socio.caso-uso.js';
import { GetSociosUseCase } from './domain/casos-uso/get-socios.caso-uso.js';
import { AutenticacionModule } from '../autenticacion/autenticacion.module.js';
import { ImageKitService } from '../common/services/imagekit.service.js';
import { CloudinaryService } from '../common/services/cloudinary.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SocioFuenteDatos]), AutenticacionModule],
  controllers: [SociosController],
  providers: [
    RegistrarSocioUseCase,
    GetSociosUseCase,
    ImageKitService,
    CloudinaryService,
  ],
})
export class SociosModule {}
