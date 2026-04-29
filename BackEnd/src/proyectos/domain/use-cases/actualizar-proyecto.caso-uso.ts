import { Inject, Injectable } from '@nestjs/common';
import type { ProyectoRepository } from '../interfaces/proyecto.repository.js';
import { PROYECTO_REPOSITORIO } from '../interfaces/proyecto.repository.js';
import { ActualizarProyectoDto } from '../../presentation/dto/actualizar-proyecto.dto.js';

@Injectable()
export class ActualizarProyectoCasoUso {
  constructor(
    @Inject(PROYECTO_REPOSITORIO)
    private readonly proyectoRepositorio: ProyectoRepository,
  ) {}

  async ejecutar(id: string, dto: ActualizarProyectoDto) {
    const { fechaInicio, fechaFinEstimado, fechaFinReal, flujoCaja, ...rest } = dto;
    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinEstimadoDate = fechaFinEstimado
      ? new Date(fechaFinEstimado)
      : undefined;
    const fechaFinRealDate = fechaFinReal ? new Date(fechaFinReal) : undefined;

    const actualizado = await this.proyectoRepositorio.update(id, {
      ...rest,
      ...(fechaInicio !== undefined ? { fechaInicio: fechaInicioDate } : {}),
      ...(fechaFinEstimado !== undefined
        ? { fechaFinEstimado: fechaFinEstimadoDate }
        : {}),
      ...(fechaFinReal !== undefined ? { fechaFinReal: fechaFinRealDate } : {}),
      ...(flujoCaja !== undefined ? { flujoCaja } : {}),
    });

    // Si se actualizaron costos o ingresos, guardamos un snapshot en el historial
    if (rest.costoTerreno || rest.costoConstruccion || rest.precioVentaTotal || rest.numeroUnidades) {
      const costoTotal = 
        Number(rest.costoTerreno || actualizado.costoTerreno || 0) + 
        Number(rest.costoConstruccion || actualizado.costoConstruccion || 0);
      
      const ingreso = Number(rest.precioVentaTotal || actualizado.precioVentaTotal || 0);
      const roi = costoTotal > 0 ? ((ingreso - costoTotal) / costoTotal) * 100 : 0;

      await this.proyectoRepositorio.createMetrica({
        proyectoId: id,
        fecha: new Date(),
        costoAcumulado: costoTotal,
        ingresoAcumulado: ingreso,
        roiActual: roi,
        unidadesVendidas: 0 // Se actualizará en el futuro con el módulo de ventas
      });
    }

    return actualizado;
  }
}
