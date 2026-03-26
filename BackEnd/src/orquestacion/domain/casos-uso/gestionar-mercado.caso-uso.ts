import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ActualizarMercadoDto } from '../../presentation/dto/mercado.dto.js';

@Injectable()
export class GestionarMercadoCasoUso {
  constructor(private readonly dataSource: DataSource) { }

  async upsertTendencias(dto: ActualizarMercadoDto) {
    try {
      const existe = await this.dataSource.query(
        'SELECT id FROM market_trends WHERE zone = $1 AND city = $2',
        [dto.zone, dto.city]
      );

      if (existe.length > 0) {
        await this.dataSource.query(
          `UPDATE market_trends 
           SET avg_price_per_m2 = $1, 
               annual_appreciation = $2, 
               last_updated = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [dto.avg_price_per_m2, dto.annual_appreciation || null, existe[0].id]
        );
        return { mensaje: 'Datos de mercado actualizados correctamente (Native PG)', accion: 'UPDATE' };
      } else {
        await this.dataSource.query(
          `INSERT INTO market_trends (id, zone, city, avg_price_per_m2, annual_appreciation, last_updated)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, CURRENT_TIMESTAMP)`,
          [dto.zone, dto.city, dto.avg_price_per_m2, dto.annual_appreciation || null]
        );
        return { mensaje: 'Nuevos datos de mercado inyectados correctamente (Native PG)', accion: 'INSERT' };
      }
    } catch (error) {
      throw new Error(`Error en UPSERT de mercado: ${error.message}`);
    }
  }
}
