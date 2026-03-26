import { Module } from '@nestjs/common';
import { TrazabilidadControlador } from './presentation/controladores/trazabilidad.controlador.js';
import { TrazabilidadCasoUso } from './domain/casos-uso/trazabilidad.caso-uso.js';

@Module({
  controllers: [TrazabilidadControlador],
  providers: [TrazabilidadCasoUso],
})
export class TrazabilidadModule {}
