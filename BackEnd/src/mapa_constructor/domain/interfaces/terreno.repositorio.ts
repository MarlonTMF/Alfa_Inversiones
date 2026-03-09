import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';

export interface TerrenoRepositorio {
  buscarPorBoundingBox(bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]>;
}

export const TERRENO_REPOSITORIO = Symbol('TERRENO_REPOSITORIO');
