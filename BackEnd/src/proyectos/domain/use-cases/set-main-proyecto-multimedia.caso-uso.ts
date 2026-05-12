import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';

@Injectable()
export class SetMainProyectoMultimediaCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(id: string, proyectoId: string) {
    const all = await this.proyectoRepositorio.findMultimediaByProyectoId(proyectoId);
    
    // Desactivar todas las demás
    for (const m of all) {
      if (m.isMain) {
        await this.proyectoRepositorio.updateMultimedia(m.id, { isMain: false });
      }
    }

    // Activar la seleccionada
    return this.proyectoRepositorio.updateMultimedia(id, { isMain: true });
  }
}
