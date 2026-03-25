import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { EstadoProyectoDto } from '../../presentation/dto/estado-proyecto.dto.js';

@Injectable()
export class ModificarEstadoProyectoCasoUso {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async ejecutar(id: string, dto: EstadoProyectoDto) {
    const client = await this.pool.connect();
    try {
      const propRes = await client.query(
        'UPDATE properties SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
        [dto.nuevo_estado, id]
      );

      if (propRes.rowCount > 0) {
         return { mensaje: 'Estado del proyecto Inmobiliario actualizado nativamente', nuevo_estado: dto.nuevo_estado };
      }

      const terrenoRes = await client.query(
        'UPDATE terrenos SET estado = $1 WHERE id = $2 RETURNING id',
        [dto.nuevo_estado, id]
      );

      if (terrenoRes.rowCount > 0) {
        return { mensaje: 'Estado del Terreno actualizado nativamente', nuevo_estado: dto.nuevo_estado };
      }

      throw new NotFoundException(`No se encontró ningún Proyecto o Terreno con el ID: ${id}`);
    } finally {
      client.release();
    }
  }
}
