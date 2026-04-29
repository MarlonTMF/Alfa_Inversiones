import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';

@Injectable()
export class GetProyectosCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar() {
    return this.proyectoRepositorio.findAll();
  }
}
