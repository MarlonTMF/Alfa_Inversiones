import { Inject, Injectable } from '@nestjs/common';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';


@Injectable()
export class GetProyectoAvancesCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(proyectoId: string) {
    return this.proyectoRepositorio.findAvancesByProyectoId(proyectoId);
  }
}
