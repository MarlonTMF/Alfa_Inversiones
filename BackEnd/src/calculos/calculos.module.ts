import { Module } from '@nestjs/common';
import { CalculosControlador } from './presentation/controladores/calculos.controlador.js';
import { CalcularViabilidadCasoUso } from './domain/casos-uso/calcular-viabilidad.caso-uso.js';

@Module({
  controllers: [CalculosControlador],
  providers: [CalcularViabilidadCasoUso],
})
export class CalculosModule {}
