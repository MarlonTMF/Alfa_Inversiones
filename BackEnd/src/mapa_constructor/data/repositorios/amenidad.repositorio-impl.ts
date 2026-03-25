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
  ) { }

  async buscarPorRadio(
    consulta: ConsultaAmenidadesDto,
  ): Promise<AmenidadRespuestaDto[]> {
    // Usamos ST_DWithin para búsqueda eficiente por radio (en metros)
    const rawAmenidades = await this.amenidadRepo
      .createQueryBuilder('amenidad')
      .select([
        'amenidad.id',
        'amenidad.nombre',
        'amenidad.tipo',
        'ST_AsGeoJSON(amenidad.coordenadas) as coords_geojson',
      ])
      .where(
        `ST_DWithin(
          amenidad.coordenadas, 
          ST_SetSRID(ST_Point(:lng, :lat), 4326)::geography, 
          :radio
        )`,
        {
          lng: consulta.lng,
          lat: consulta.lat,
          radio: consulta.radio,
        },
      )
      .andWhere('amenidad.tipo = :tipo', { tipo: consulta.tipo })
      .getRawMany();

    return rawAmenidades.map((raw) => {
      const geojson = JSON.parse(raw.coords_geojson);
      return {
        id: raw.amenidad_id,
        nombre: raw.amenidad_nombre,
        tipo: raw.amenidad_tipo,
        lat: geojson.coordinates[1],
        lng: geojson.coordinates[0],
      };
    });
  }
}
