import { Controller, Get, Query } from '@nestjs/common';
import { ObtenerTerrenosCasoUso } from '../../domain/casos-uso/obtener-terrenos.caso-uso.js';
import { BoundingBoxDto } from '../dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../dto/terreno-respuesta.dto.js';

@Controller('terrenos')
export class TerrenosControlador {
  constructor(private readonly obtenerTerrenos: ObtenerTerrenosCasoUso) {}

  @Get()
  async listar(@Query() bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]> {
    return this.obtenerTerrenos.ejecutar(bbox);
  }
}
