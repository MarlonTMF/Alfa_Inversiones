import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import { ProyectoMultimedia } from '../../data/fuentes-datos/proyecto-multimedia.fuente-datos.js';

@Injectable()
export class AddProyectoMultimediaCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(multimedia: Partial<ProyectoMultimedia>) {
    return this.proyectoRepositorio.createMultimedia(multimedia);
  }
}
