import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CalcularViabilidadCasoUso } from '../../domain/casos-uso/calcular-viabilidad.caso-uso.js';
import { CalcularPermutaCasoUso } from '../../domain/casos-uso/calcular-permuta.caso-uso.js';
import { CalculoViabilidadDto } from '../dto/calculo-viabilidad.dto.js';
import { CalculoPermutaDto } from '../dto/calculo-permuta.dto.js';

@Controller('calculos')
export class CalculosControlador {
  constructor(
    private readonly calcularViabilidadCasoUso: CalcularViabilidadCasoUso,
    private readonly calcularPermutaCasoUso: CalcularPermutaCasoUso,
  ) {}

  @Post('viabilidad')
  @HttpCode(HttpStatus.OK)
  async calcularViabilidad(@Body() dto: CalculoViabilidadDto) {
    return this.calcularViabilidadCasoUso.ejecutar(dto);
  }

  @Post('permuta')
  @HttpCode(HttpStatus.OK)
  async calcularPermuta(@Body() dto: CalculoPermutaDto) {
    return this.calcularPermutaCasoUso.ejecutar(dto);
  }
}
