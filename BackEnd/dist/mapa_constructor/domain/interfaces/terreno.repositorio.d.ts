import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';
import { CrearTerrenoDto } from '../../presentation/dto/crear-terreno.dto.js';
export interface TerrenoRepositorio {
    buscarPorBoundingBox(bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]>;
    crear(dto: CrearTerrenoDto): Promise<{
        mensaje: string;
    }>;
}
export declare const TERRENO_REPOSITORIO: unique symbol;
