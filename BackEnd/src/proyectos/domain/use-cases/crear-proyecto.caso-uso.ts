import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import { CrearProyectoDto } from '../../presentation/dto/crear-proyecto.dto.js';

@Injectable()
export class CrearProyectoCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(dto: CrearProyectoDto, creatorId?: string) {
    const { fechaInicio, fechaFinEstimado, fechaFinReal, ...rest } = dto;
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinEstimadoDate = fechaFinEstimado
      ? new Date(fechaFinEstimado)
      : undefined;
    const fechaFinRealDate = fechaFinReal ? new Date(fechaFinReal) : undefined;

    return this.proyectoRepositorio.create({
      ...rest,
      ...(fechaInicio !== undefined ? { fechaInicio: fechaInicioDate } : {}),
      ...(fechaFinEstimado !== undefined
        ? { fechaFinEstimado: fechaFinEstimadoDate }
        : {}),
      ...(fechaFinReal !== undefined ? { fechaFinReal: fechaFinRealDate } : {}),
      ...(dto.flujoCaja !== undefined ? { flujoCaja: dto.flujoCaja } : {}),
      creatorId,
    });
  }
}
