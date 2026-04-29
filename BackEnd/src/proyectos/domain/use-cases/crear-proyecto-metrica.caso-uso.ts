import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import { CrearProyectoMetricaDto } from '../../presentation/dto/crear-proyecto-metrica.dto.js';

@Injectable()
export class CrearProyectoMetricaCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(proyectoId: string, dto: CrearProyectoMetricaDto) {
    const { fecha, ...rest } = dto;
    return this.proyectoRepositorio.createMetrica({
      ...rest,
      proyectoId,
      fecha: new Date(fecha),
    });
  }
}
