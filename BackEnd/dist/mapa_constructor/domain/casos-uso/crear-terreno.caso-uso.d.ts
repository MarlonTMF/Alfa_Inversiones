import type { TerrenoRepositorio } from '../interfaces/terreno.repositorio.js';
import { CrearTerrenoDto } from '../../presentation/dto/crear-terreno.dto.js';
export declare class CrearTerrenoCasoUso {
    private readonly terrenoRepositorio;
    constructor(terrenoRepositorio: TerrenoRepositorio);
    ejecutar(dto: CrearTerrenoDto): Promise<{
        mensaje: string;
    }>;
}
