import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CalcularViabilidadCasoUso } from '../../domain/casos-uso/calcular-viabilidad.caso-uso.js';
import { CalculoViabilidadDto } from '../dto/calculo-viabilidad.dto.js';

@Controller('calculos')
export class CalculosControlador {
  constructor(private readonly calcularViabilidadCasoUso: CalcularViabilidadCasoUso) {}

  @Post('viabilidad')
  @HttpCode(HttpStatus.OK)
  async calcularViabilidad(@Body() dto: CalculoViabilidadDto) {
    return this.calcularViabilidadCasoUso.ejecutar(dto);
  }
}
