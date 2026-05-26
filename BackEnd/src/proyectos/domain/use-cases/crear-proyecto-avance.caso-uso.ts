import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';


@Injectable()
export class CrearProyectoAvanceCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(proyectoId: string, dto: any) {
    const proyecto = await this.proyectoRepositorio.findById(proyectoId);
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');

    // 1. Crear el registro en la bitácora (Avance)
    const avance = await this.proyectoRepositorio.createAvance({
      proyectoId,
      faseId: dto.faseId,
      descripcion: dto.descripcion,
      porcentajeAvance: dto.porcentajeAvance,
      fechaReporte: dto.fechaReporte || new Date(),
      multimedia: dto.multimedia || [],
    });

    // 2. Si el avance está vinculado a una fase, actualizar el progreso de dicha fase
    if (dto.faseId) {
      const fase = await this.proyectoRepositorio.findFaseById(dto.faseId);
      if (fase) {
        // El progreso de la fase se actualiza con el valor reportado en el avance
        await this.proyectoRepositorio.updateFase(dto.faseId, {
          progreso: dto.porcentajeAvance,
          // Si el progreso es 100, marcar como completada
          estado: dto.porcentajeAvance >= 100 ? 'completado' : 'en_progreso',
          // Registrar fecha de inicio real si es el primer avance
          fechaInicioReal: fase.fechaInicioReal || new Date(),
          // Registrar fecha de fin real si es el 100%
          fechaFinReal: dto.porcentajeAvance >= 100 ? new Date() : fase.fechaFinReal,
        });
      }
    }

    return avance;
  }
}
