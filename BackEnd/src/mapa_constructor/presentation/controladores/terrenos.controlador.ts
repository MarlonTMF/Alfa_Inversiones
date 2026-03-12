import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ObtenerTerrenosCasoUso } from '../../domain/casos-uso/obtener-terrenos.caso-uso.js';
import { CrearTerrenoCasoUso } from '../../domain/casos-uso/crear-terreno.caso-uso.js';
import { BoundingBoxDto } from '../dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../dto/terreno-respuesta.dto.js';
import { CrearTerrenoDto } from '../dto/crear-terreno.dto.js';

@Controller('terrenos')
export class TerrenosControlador {
  constructor(
    private readonly obtenerTerrenos: ObtenerTerrenosCasoUso,
    private readonly crearTerreno: CrearTerrenoCasoUso,
  ) {}

  @Get()
  async listar(@Query() bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]> {
    return this.obtenerTerrenos.ejecutar(bbox);
  }

  @Post()
  async crear(@Body() dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    return this.crearTerreno.ejecutar(dto);
  }
}
