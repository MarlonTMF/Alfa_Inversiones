import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';

@Injectable()
export class GetProyectoPorIdCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(id: string) {
    const proyecto = await this.proyectoRepositorio.findById(id);
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return proyecto;
  }
}
