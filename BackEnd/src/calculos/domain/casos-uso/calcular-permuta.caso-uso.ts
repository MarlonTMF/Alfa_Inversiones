import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CalculoPermutaDto } from '../../presentation/dto/calculo-permuta.dto.js';

@Injectable()
export class CalcularPermutaCasoUso {
  constructor(private readonly dataSource: DataSource) {}

  async ejecutar(dto: CalculoPermutaDto): Promise<any> {
    let costoSuelo = dto.costo_suelo;

    // Extracción inteligente desde la base de datos (TABLA UNIFICADA properties)
    if (!costoSuelo) {
      if (dto.terreno_id || dto.property_id) {
        const idToSearch = dto.terreno_id || dto.property_id;
        const res = await this.dataSource.query(
          'SELECT price_per_m2, total_area, base_price_negotiation FROM properties WHERE id = $1',
          [idToSearch],
        );

        if (!res.length) throw new NotFoundException('Propiedad no encontrada');

        // Prioriza base_price_negotiation, si es 0 usa (price_per_m2 * total_area)
        costoSuelo = Number(
          res[0].base_price_negotiation ||
            res[0].price_per_m2 * res[0].total_area,
        );
      } else {
        throw new BadRequestException(
          'Debe proveer costo_suelo, terreno_id o property_id',
        );
      }
    }

    if (!dto.precio_venta_unidad)
      throw new BadRequestException(
        'Falta parámetro precio_venta_unidad para calcular las opciones de permuta física',
      );
    if (!dto.ventas_proyectadas)
      throw new BadRequestException(
        'Falta parámetro ventas_proyectadas para calcular la sociedad',
      );

    // Opción 1: Unidades Físicas (Costo del suelo / Precio de la unidad prospecto)
    const unidadesEquivalentes = costoSuelo / dto.precio_venta_unidad;

    // Opción 2: Participación accionaria (Porcentaje del suelo respecto al proyecto total)
    const porcentajeParticipacion = (costoSuelo / dto.ventas_proyectadas) * 100;

    return {
      operacion: 'Convertidor de Permutas (BE-3.2)',
      metricas_entregadas: {
        terreno_valorado_en: costoSuelo,
        precio_unidad: dto.precio_venta_unidad,
        ventas_totales_proyectadas: dto.ventas_proyectadas,
      },
      opcion_1_fisica: {
        descripcion:
          'Permuta por unidades construidas (Departamentos, Locales, etc.)',
        unidades_entregables: Number(unidadesEquivalentes.toFixed(2)),
        nota: `El propietario recibirá el equivalente a ${Math.floor(unidadesEquivalentes)} unidades enteras más compensación por el remanente en efectivo.`,
      },
      opcion_2_financiera: {
        descripcion:
          'Participación sobre el proyecto (Esquema de Sociedad / Joint Venture)',
        porcentaje_participacion: Number(porcentajeParticipacion.toFixed(2)),
        ingreso_estimado: Number(
          ((porcentajeParticipacion / 100) * dto.ventas_proyectadas).toFixed(2),
        ),
        nota: `El propietario del suelo pasará a ser socio participando de un ${Number(porcentajeParticipacion.toFixed(2))}% de las utilidades.`,
      },
    };
  }
}
