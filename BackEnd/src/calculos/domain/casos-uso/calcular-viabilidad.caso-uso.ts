import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CalculoViabilidadDto } from '../../presentation/dto/calculo-viabilidad.dto.js';

@Injectable()
export class CalcularViabilidadCasoUso {
  constructor(private readonly dataSource: DataSource) {}

  async ejecutar(dto: CalculoViabilidadDto): Promise<any> {
    let costoSuelo = dto.costo_suelo;

    // Si no enviaron costo_suelo pero sí un ID de terreno o propiedad, lo buscamos en BD
    if (!costoSuelo) {
      if (dto.terreno_id) {
        const res = await this.dataSource.query('SELECT precio FROM terrenos WHERE id = $1', [dto.terreno_id]);
        if (!res.length) throw new NotFoundException('Terreno no encontrado');
        costoSuelo = Number(res[0].precio);
      } else if (dto.property_id) {
        const res = await this.dataSource.query('SELECT price_per_m2, total_area, base_price_negotiation FROM properties WHERE id = $1', [dto.property_id]);
        if (!res.length) throw new NotFoundException('Propiedad no encontrada');
        // Asume base_price_negotiation o (price_per_m2 * total_area) como costo
        costoSuelo = Number(res[0].base_price_negotiation || (res[0].price_per_m2 * res[0].total_area));
      }
    }

    if (dto.rol === 'constructor') {
      return this.calcularLogicaConstructor(dto, costoSuelo);
    } else if (dto.rol === 'inversionista') {
      return this.calcularLogicaInversionista(dto);
    }

    throw new BadRequestException('Rol no soportado para cálculos de viabilidad');
  }

  private calcularLogicaConstructor(dto: CalculoViabilidadDto, costoSuelo?: number) {
    if (!costoSuelo) throw new BadRequestException('Falta costo_suelo o un ID de terreno válido');
    if (!dto.ventas_proyectadas) throw new BadRequestException('Falta parámetro ventas_proyectadas para el constructor');
    if (!dto.costo_construccion) throw new BadRequestException('Falta parámetro costo_construccion para el constructor');

    const incidenciaSuelo = (costoSuelo / dto.ventas_proyectadas) * 100;
    const utilidad = dto.ventas_proyectadas - costoSuelo - dto.costo_construccion;
    const margenUtilidad = (utilidad / dto.ventas_proyectadas) * 100;

    const esViableSuelo = incidenciaSuelo >= 30 && incidenciaSuelo <= 40;
    const esViableUtilidad = margenUtilidad > 0 && margenUtilidad <= 60;

    return {
      rol: 'constructor',
      metricas: {
        costo_suelo: costoSuelo,
        costo_construccion: dto.costo_construccion,
        ventas_proyectadas: dto.ventas_proyectadas,
        utilidad_proyectada: utilidad,
        incidencia_suelo_porcentaje: Number(incidenciaSuelo.toFixed(2)),
        margen_utilidad_porcentaje: Number(margenUtilidad.toFixed(2)),
      },
      validaciones: {
        suelo_en_rango_optimo: esViableSuelo, // true si entra en 30%-40%
        utilidad_alcanza_rango: esViableUtilidad, // true si utilidad está hasta 60%
        es_proyecto_viable: esViableSuelo && esViableUtilidad
      },
      mensaje: esViableSuelo && esViableUtilidad 
        ? "El proyecto es estructuralmente viable bajo los parámetros del constructor." 
        : "Existen alertas de viabilidad en las proporciones de costo o utilidad."
    };
  }

  private calcularLogicaInversionista(dto: CalculoViabilidadDto) {
    if (!dto.ticket_inversion) throw new BadRequestException('Falta parámetro ticket_inversion para el inversionista');
    if (!dto.flujo_anual_proyectado) throw new BadRequestException('Falta parámetro flujo_anual_proyectado (o un property_id válido que lo soporte)');

    const paybackAnos = dto.ticket_inversion / dto.flujo_anual_proyectado;
    const paybackMeses = paybackAnos * 12;

    return {
      rol: 'inversionista',
      metricas: {
        ticket_ingresado: dto.ticket_inversion,
        flujo_anual: dto.flujo_anual_proyectado,
        payback_years: Number(paybackAnos.toFixed(1)),
        payback_months: Math.ceil(paybackMeses)
      },
      mensaje: `El Payback proyectado tomará aproximadamente ${Number(paybackAnos.toFixed(1))} años (${Math.ceil(paybackMeses)} meses).`
    };
  }
}
