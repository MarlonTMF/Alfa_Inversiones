import type { AmenidadRepositorio } from '../interfaces/amenidad.repositorio.js';
import { ConsultaAmenidadesDto } from '../../presentation/dto/consulta-amenidades.dto.js';
import { AmenidadRespuestaDto } from '../../presentation/dto/amenidad-respuesta.dto.js';
export declare class ObtenerAmenidadesCasoUso {
    private readonly amenidadRepositorio;
    constructor(amenidadRepositorio: AmenidadRepositorio);
    ejecutar(consulta: ConsultaAmenidadesDto): Promise<AmenidadRespuestaDto[]>;
}
