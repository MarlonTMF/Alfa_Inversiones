import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import { CrearProyectoFaseDto } from '../../presentation/dto/crear-proyecto-fase.dto.js';

@Injectable()
export class CrearProyectoFaseCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(proyectoId: string, dto: CrearProyectoFaseDto) {
    const {
      fechaInicioEstimada,
      fechaFinEstimada,
      fechaInicioReal,
      fechaFinReal,
      ...rest
    } = dto;

    return this.proyectoRepositorio.createFase({
      ...rest,
      proyectoId,
      ...(fechaInicioEstimada !== undefined
        ? { fechaInicioEstimada: new Date(fechaInicioEstimada) }
        : {}),
      ...(fechaFinEstimada !== undefined
        ? { fechaFinEstimada: new Date(fechaFinEstimada) }
        : {}),
      ...(fechaInicioReal !== undefined
        ? { fechaInicioReal: new Date(fechaInicioReal) }
        : {}),
      ...(fechaFinReal !== undefined
        ? { fechaFinReal: new Date(fechaFinReal) }
        : {}),
    });
  }
}
