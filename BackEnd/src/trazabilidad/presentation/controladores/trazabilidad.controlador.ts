import { Controller, Post, Body, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TrazabilidadCasoUso } from '../../domain/casos-uso/trazabilidad.caso-uso.js';
import { RegistrarInteresDto } from '../dto/registrar-interes.dto.js';

@Controller('trazabilidad')
export class TrazabilidadControlador {
  constructor(private readonly trazabilidadCasoUso: TrazabilidadCasoUso) {}

  @Post('interes')
  @HttpCode(HttpStatus.CREATED)
  async registrarInteres(@Body() dto: RegistrarInteresDto) {
    return this.trazabilidadCasoUso.registrarInteres(dto);
  }

  @Get('split/:terreno_id')
  async calcularSplit(
    @Param('terreno_id') terrenoId: string,
    @Query('ventas_proyectadas') ventasProyectadas: number
  ) {
    return this.trazabilidadCasoUso.calcularSplit(terrenoId, Number(ventasProyectadas));
  }

  @Get('legal/:property_id')
  async obtenerEstadoLegal(@Param('property_id') propertyId: string) {
    return this.trazabilidadCasoUso.obtenerEstadoLegal(propertyId);
  }
}
