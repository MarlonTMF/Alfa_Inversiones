import type { TerrenoRepositorio } from '../interfaces/terreno.repositorio.js';
import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';
export declare class ObtenerTerrenosCasoUso {
    private readonly terrenoRepositorio;
    constructor(terrenoRepositorio: TerrenoRepositorio);
    ejecutar(bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]>;
}
