import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EstadoProyectoDto } from '../../presentation/dto/estado-proyecto.dto.js';

@Injectable()
export class ModificarEstadoProyectoCasoUso {
  constructor(private readonly dataSource: DataSource) {}

  async ejecutar(id: string, dto: EstadoProyectoDto) {
    try {
      const propRes = await this.dataSource.query(
        'UPDATE properties SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
        [dto.nuevo_estado, id],
      );

      if (propRes.length > 0) {
        return {
          mensaje: 'Estado del proyecto Inmobiliario actualizado nativamente',
          nuevo_estado: dto.nuevo_estado,
        };
      }

      // Si no se encuentra en properties, lanzamos una excepción clara
      throw new NotFoundException(
        `No se encontró ninguna Propiedad con el ID: ${id}`,
      );
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(
        `Error al actualizar estado del proyecto: ${error.message}`,
      );
    }
  }
}
