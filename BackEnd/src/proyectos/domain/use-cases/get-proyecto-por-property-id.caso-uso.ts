import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';

@Injectable()
export class GetProyectoPorPropertyIdCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(propertyId: string) {
    const proyecto =
      await this.proyectoRepositorio.findByPropertyId(propertyId);
    if (!proyecto)
      throw new NotFoundException(
        'Proyecto no encontrado para este propertyId',
      );
    return proyecto;
  }
}
