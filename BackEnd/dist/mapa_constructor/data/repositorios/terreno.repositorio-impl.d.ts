import { Repository } from 'typeorm';
import { TerrenoRepositorio } from '../../domain/interfaces/terreno.repositorio.js';
import { TerrenoFuenteDatos } from '../fuentes-datos/terreno.fuente-datos.js';
import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';
export declare class TerrenoRepositorioImpl implements TerrenoRepositorio {
    private readonly terrenoRepo;
    constructor(terrenoRepo: Repository<TerrenoFuenteDatos>);
    buscarPorBoundingBox(bbox: BoundingBoxDto): Promise<TerrenoRespuestaDto[]>;
}
