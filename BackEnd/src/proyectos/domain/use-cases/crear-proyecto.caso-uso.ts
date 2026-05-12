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

    // Cálculos financieros automáticos
    const precioVentaTotal = dto.precioVentaTotal || (dto.numeroUnidades || 0) * (dto.precioUnitario || 0);
    
    const costosTotales = 
      (dto.costoTerreno || 0) + 
      (dto.costoConstruccion || 0) + 
      (dto.costoIndirectos || 0) + 
      (dto.costoMarketing || 0) + 
      (dto.costoPermisos || 0) + 
      (dto.costoFinanciero || 0) + 
      (dto.contingencia || 0);

    let roi = dto.roi;
    let margenUtilidad = dto.margenUtilidad;

    if (costosTotales > 0) {
      if (roi === undefined) {
        roi = Math.round(((precioVentaTotal - costosTotales) / costosTotales) * 10000) / 100;
      }
    }

    if (precioVentaTotal > 0) {
      if (margenUtilidad === undefined) {
        margenUtilidad = Math.round(((precioVentaTotal - costosTotales) / precioVentaTotal) * 10000) / 100;
      }
    }

    return this.proyectoRepositorio.create({
      ...rest,
      precioVentaTotal,
      roi,
      margenUtilidad,
      presupuestoTotal: dto.presupuestoTotal || costosTotales,
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
