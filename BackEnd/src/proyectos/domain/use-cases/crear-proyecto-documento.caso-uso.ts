import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import { CrearProyectoDocumentoDto } from '../../presentation/dto/crear-proyecto-documento.dto.js';

@Injectable()
export class CrearProyectoDocumentoCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(proyectoId: string, dto: CrearProyectoDocumentoDto) {
    return this.proyectoRepositorio.createDocumento({
      proyectoId,
      ...dto,
    });
  }
}
