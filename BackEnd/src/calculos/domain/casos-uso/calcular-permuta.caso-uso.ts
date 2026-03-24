import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CalculoPermutaDto } from '../../presentation/dto/calculo-permuta.dto.js';

@Injectable()
export class CalcularPermutaCasoUso {
  constructor(private readonly dataSource: DataSource) {}

  async ejecutar(dto: CalculoPermutaDto): Promise<any> {
    let costoSuelo = dto.costo_suelo;

    // Extracción inteligente desde la base de datos si mandan ID
    if (!costoSuelo) {
      if (dto.terreno_id) {
        const res = await this.dataSource.query('SELECT precio FROM terrenos WHERE id = $1', [dto.terreno_id]);
        if (!res.length) throw new NotFoundException('Terreno no encontrado');
        costoSuelo = Number(res[0].precio);
      } else if (dto.property_id) {
        const res = await this.dataSource.query('SELECT price_per_m2, total_area, base_price_negotiation FROM properties WHERE id = $1', [dto.property_id]);
        if (!res.length) throw new NotFoundException('Propiedad no encontrada');
        costoSuelo = Number(res[0].base_price_negotiation || (res[0].price_per_m2 * res[0].total_area));
      } else {
        throw new BadRequestException('Debe proveer costo_suelo, terreno_id o property_id');
      }
    }

    if (!dto.precio_venta_unidad) throw new BadRequestException('Falta parámetro precio_venta_unidad para calcular las opciones de permuta física');
    if (!dto.ventas_proyectadas) throw new BadRequestException('Falta parámetro ventas_proyectadas para calcular la sociedad');

    // Opción 1: Unidades Físicas (Costo del suelo / Precio de la unidad prospecto)
    const unidadesEquivalentes = costoSuelo / dto.precio_venta_unidad;

    // Opción 2: Participación accionaria (Porcentaje del suelo respecto al proyecto total en base a ventas o costos)
    // Formula estándar: valor del aporte / valor total proyectado del negocio
    const porcentajeParticipacion = (costoSuelo / dto.ventas_proyectadas) * 100;

    return {
      operacion: 'Convertidor de Permutas (BE-3.2)',
      metricas_entregadas: {
        terreno_valorado_en: costoSuelo,
        precio_unidad: dto.precio_venta_unidad,
        ventas_totales_proyectadas: dto.ventas_proyectadas
      },
      opcion_1_fisica: {
        descripcion: 'Permuta por unidades construidas (Departamentos, Locales, etc.)',
        unidades_entregables: Number(unidadesEquivalentes.toFixed(2)),
        nota: `El propietario recibirá el equivalente a ${Math.floor(unidadesEquivalentes)} unidades enteras más compensación por el remanente en efectivo o ajustado en la negociación.`
      },
      opcion_2_financiera: {
        descripcion: 'Participación sobre el proyecto (Esquema de Sociedad / Joint Venture)',
        porcentaje_participacion: Number(porcentajeParticipacion.toFixed(2)),
        ingreso_estimado: Number(((porcentajeParticipacion / 100) * dto.ventas_proyectadas).toFixed(2)),
        nota: `El propietario del suelo pasará a ser socio participando de un ${Number(porcentajeParticipacion.toFixed(2))}% de las utilidades completas del ciclo de ventas.`
      }
    };
  }
}
