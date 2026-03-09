import { Inject, Injectable } from '@nestjs/common';
import type { TerrenoRepositorio } from '../interfaces/terreno.repositorio.js';
import { TERRENO_REPOSITORIO } from '../interfaces/terreno.repositorio.js';
import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';

@Injectable()
export class ObtenerTerrenosCasoUso {
  constructor(
    @Inject(TERRENO_REPOSITORIO)
    private readonly terrenoRepositorio: TerrenoRepositorio,
  ) {}

  async ejecutar(bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]> {
    return this.terrenoRepositorio.buscarPorBoundingBox(bbox);
  }
}
