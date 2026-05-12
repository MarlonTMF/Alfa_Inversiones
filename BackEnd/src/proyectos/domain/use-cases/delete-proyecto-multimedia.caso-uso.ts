import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';

@Injectable()
export class DeleteProyectoMultimediaCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(id: string) {
    return this.proyectoRepositorio.deleteMultimedia(id);
  }
}
