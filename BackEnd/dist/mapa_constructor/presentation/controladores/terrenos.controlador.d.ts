import { ObtenerTerrenosCasoUso } from '../../domain/casos-uso/obtener-terrenos.caso-uso.js';
import { BoundingBoxDto } from '../dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../dto/terreno-respuesta.dto.js';
export declare class TerrenosControlador {
    private readonly obtenerTerrenos;
    constructor(obtenerTerrenos: ObtenerTerrenosCasoUso);
    listar(bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]>;
}
