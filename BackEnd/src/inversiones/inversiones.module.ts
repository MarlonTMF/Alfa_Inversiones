import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversionFuenteDatos } from './data/fuentes-datos/inversion.fuente-datos.js';
import { InversionesController } from './presentation/controladores/inversiones.controlador.js';
import { RegistrarInversionUseCase } from './domain/casos-uso/registrar-inversion.caso-uso.js';
import { ImageKitService } from '../common/services/imagekit.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([InversionFuenteDatos])],
  controllers: [InversionesController],
  providers: [RegistrarInversionUseCase, ImageKitService],
})
export class InversionesModule {}
