import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RegistrarInteresDto } from '../../presentation/dto/registrar-interes.dto.js';

@Injectable()
export class TrazabilidadCasoUso {
  constructor(private readonly dataSource: DataSource) { }

  // 1. Registrar Interés en la tabla Favoritos (Adaptado a UNIFICADA)
  async registrarInteres(dto: RegistrarInteresDto) {
    if (!dto.terreno_id && !dto.property_id) {
      throw new BadRequestException('Debe proveer terreno_id o property_id');
    }

    // En la arquitectura unificada, ambos IDs deben apuntar a la misma entidad Property
    const finalPropertyId = dto.property_id || dto.terreno_id;

    await this.dataSource.query(
      `INSERT INTO favoritos (id_usuario, id_propiedad) VALUES ($1, $2)`,
      [dto.usuario_id, finalPropertyId]
    );

    return {
      mensaje: 'Interés de inversión registrado exitosamente (Unificado)',
      vinculo: {
        usuario_id: dto.usuario_id,
        property_id: finalPropertyId
      }
    };
  }

  // 2. Calcular Split Interno (Adaptado a TABLA UNIFICADA properties)
  async calcularSplit(propertyId: string, ventasProyectadas: number) {
    const res = await this.dataSource.query(
      'SELECT price_per_m2, total_area, base_price_negotiation FROM properties WHERE id = $1',
      [propertyId]
    );

    if (!res.length) throw new NotFoundException('Propiedad no encontrada en el sistema unificado');

    // Lógica consistente de valoración de suelo
    const costoSuelo = Number(res[0].base_price_negotiation || (res[0].price_per_m2 * res[0].total_area));

    const splitPropietario = (costoSuelo / ventasProyectadas) * 100;
    const splitConstructor = 100 - splitPropietario;

    return {
      property_id: propertyId,
      valor_suelo_extraido: costoSuelo,
      ventas_proyectadas: ventasProyectadas,
      distribucion_ganancia: {
        propietario_suelo_porcentaje: Number(splitPropietario.toFixed(2)),
        constructor_porcentaje: Number(splitConstructor.toFixed(2)),
      },
      estado: splitPropietario <= 40 ? 'Viable para Joint Venture' : 'Riesgo: Suelo demasiado caro para el split estándar'
    };
  }

  // 3. Consumir Estados Legales y Porcentaje de Avance
  async obtenerEstadoLegal(propertyId: string) {
    const docs = await this.dataSource.query(
      'SELECT id, doc_type, status, file_path, updated_at FROM legal_docs WHERE property_id = $1',
      [propertyId]
    );

    const steps = await this.dataSource.query(
      'SELECT id, title, description, status, progress, estimated_date FROM legal_tracking_steps WHERE property_id = $1',
      [propertyId]
    );

    // Calcular progreso físico/legal global basado en los tracking steps
    let progresoGlobal = 0;
    if (steps.length > 0) {
      const sum = steps.reduce((acc, step) => acc + Number(step.progress || 0), 0);
      progresoGlobal = sum / steps.length;
    }

    return {
      property_id: propertyId,
      avance_global_porcentaje: Number(progresoGlobal.toFixed(2)),
      tracking_fisico_legal: steps,
      documentos_legales: docs
    };
  }
}
