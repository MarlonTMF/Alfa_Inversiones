import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { ActualizarMercadoDto } from '../../presentation/dto/mercado.dto.js';

@Injectable()
export class GestionarMercadoCasoUso {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async upsertTendencias(dto: ActualizarMercadoDto) {
    const client = await this.pool.connect();
    try {
      const existe = await client.query(
        'SELECT id FROM market_trends WHERE zone = $1 AND city = $2',
        [dto.zone, dto.city]
      );

      if (existe.rowCount > 0) {
        await client.query(
          `UPDATE market_trends 
           SET avg_price_per_m2 = $1, 
               annual_appreciation = $2, 
               last_updated = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [dto.avg_price_per_m2, dto.annual_appreciation || null, existe.rows[0].id]
        );
        return { mensaje: 'Datos de mercado actualizados correctamente (Native PG)', accion: 'UPDATE' };
      } else {
        await client.query(
          `INSERT INTO market_trends (id, zone, city, avg_price_per_m2, annual_appreciation, last_updated)
           VALUES (uuid_generate_v4(), $1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [dto.zone, dto.city, dto.avg_price_per_m2, dto.annual_appreciation || null]
        );
        return { mensaje: 'Nuevos datos de mercado inyectados correctamente (Native PG)', accion: 'INSERT' };
      }
    } finally {
      client.release();
    }
  }
}
