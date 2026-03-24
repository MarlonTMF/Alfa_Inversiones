import { Inject, Injectable } from '@nestjs/common';
import type { TerrenoRepositorio } from '../interfaces/terreno.repositorio.js';
import { TERRENO_REPOSITORIO } from '../interfaces/terreno.repositorio.js';
import { CrearTerrenoDto } from '../../presentation/dto/crear-terreno.dto.js';

@Injectable()
export class CrearTerrenoCasoUso {
  constructor(
    @Inject(TERRENO_REPOSITORIO)
    private readonly terrenoRepositorio: TerrenoRepositorio,
  ) {}

  async ejecutar(dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    return this.terrenoRepositorio.crear(dto);
  }
}
