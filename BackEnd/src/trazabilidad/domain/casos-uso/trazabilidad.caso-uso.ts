import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RegistrarInteresDto } from '../../presentation/dto/registrar-interes.dto.js';

@Injectable()
export class TrazabilidadCasoUso {
  constructor(private readonly dataSource: DataSource) {}

  // 1. Registrar Interés en la tabla Favoritos existentes
  async registrarInteres(dto: RegistrarInteresDto) {
    if (!dto.terreno_id && !dto.property_id) {
      throw new BadRequestException('Debe proveer terreno_id o property_id');
    }

    await this.dataSource.query(
      `INSERT INTO favoritos (id_usuario, id_terreno, id_propiedad) VALUES ($1, $2, $3)`,
      [dto.usuario_id, dto.terreno_id || null, dto.property_id || null]
    );

    return {
      mensaje: 'Interés de inversión registrado exitosamente',
      vinculo: dto
    };
  }

  // 2. Calcular Split Interno (Constructor vs Propietario)
  async calcularSplit(terrenoId: string, ventasProyectadas: number) {
    const res = await this.dataSource.query('SELECT precio FROM terrenos WHERE id = $1', [terrenoId]);
    if (!res.length) throw new NotFoundException('Terreno no encontrado');
    
    const costoSuelo = Number(res[0].precio);
    const splitPropietario = (costoSuelo / ventasProyectadas) * 100;
    const splitConstructor = 100 - splitPropietario;

    return {
      terreno_id: terrenoId,
      valor_terreno: costoSuelo,
      ventas_proyectadas: ventasProyectadas,
      distribucion_ganancia: {
        propietario_suelo_porcentaje: Number(splitPropietario.toFixed(2)),
        constructor_porcentaje: Number(splitConstructor.toFixed(2)),
      },
      estado: splitPropietario <= 40 ? 'Viable para Joint Venture' : 'Riesgo: Suelo demasiado caro'
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
