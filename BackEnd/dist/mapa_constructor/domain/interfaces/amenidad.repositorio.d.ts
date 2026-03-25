import { ConsultaAmenidadesDto } from '../../presentation/dto/consulta-amenidades.dto.js';
import { AmenidadRespuestaDto } from '../../presentation/dto/amenidad-respuesta.dto.js';
export interface AmenidadRepositorio {
    buscarPorRadio(consulta: ConsultaAmenidadesDto): Promise<AmenidadRespuestaDto[]>;
}
export declare const AMENIDAD_REPOSITORIO: unique symbol;
