import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmenidadRepositorio } from '../../domain/interfaces/amenidad.repositorio.js';
import { AmenidadFuenteDatos } from '../fuentes-datos/amenidad.fuente-datos.js';
import { ConsultaAmenidadesDto } from '../../presentation/dto/consulta-amenidades.dto.js';
import { AmenidadRespuestaDto } from '../../presentation/dto/amenidad-respuesta.dto.js';

@Injectable()
export class AmenidadRepositorioImpl implements AmenidadRepositorio {
  constructor(
    @InjectRepository(AmenidadFuenteDatos)
    private readonly amenidadRepo: Repository<AmenidadFuenteDatos>,
  ) {}

  async buscarPorRadio(
    consulta: ConsultaAmenidadesDto,
  ): Promise<AmenidadRespuestaDto[]> {
    // Fórmula de Haversine simplificada para SQLite.
    // En producción con PostGIS usar ST_DWithin.
    const amenidades = await this.amenidadRepo.find({
      where: { tipo: consulta.tipo },
    });

    const radioKm = consulta.radio / 1000;

    return amenidades
      .filter((amenidad) => {
        const distancia = this.calcularDistanciaKm(
          consulta.lat,
          consulta.lng,
          amenidad.lat,
          amenidad.lng,
        );
        return distancia <= radioKm;
      })
      .map((amenidad) => ({
        id: amenidad.id,
        nombre: amenidad.nombre,
        tipo: amenidad.tipo,
        lat: amenidad.lat,
        lng: amenidad.lng,
      }));
  }

  private calcularDistanciaKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.aRadianes(lat2 - lat1);
    const dLng = this.aRadianes(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.aRadianes(lat1)) *
        Math.cos(this.aRadianes(lat2)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private aRadianes(grados: number): number {
    return grados * (Math.PI / 180);
  }
}
