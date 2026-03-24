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
    // Usamos ST_DWithin con ::geography para calcular el radio en metros precisos.
    const rawAmenidades = await this.amenidadRepo.createQueryBuilder('amenidad')
      .select([
        'amenidad.id AS id',
        'amenidad.nombre AS nombre',
        'amenidad.tipo AS tipo',
      ])
      .addSelect('ST_AsGeoJSON(amenidad.coordenadas)', 'coordenadas_geojson')
      .where('amenidad.tipo = :tipo', { tipo: consulta.tipo })
      .andWhere(
        'ST_DWithin(amenidad.coordenadas::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radio)',
        { lng: consulta.lng, lat: consulta.lat, radio: consulta.radio }
      )
      .getRawMany();

    return rawAmenidades.map((row) => {
      let lat = 0;
      let lng = 0;
      if (row.coordenadas_geojson) {
        const geojson = JSON.parse(row.coordenadas_geojson);
        // GeoJSON Point format: { type: "Point", coordinates: [lng, lat] }
        if (geojson.coordinates) {
          lng = geojson.coordinates[0];
          lat = geojson.coordinates[1];
        }
      }
      return {
        id: row.id,
        nombre: row.nombre,
        tipo: row.tipo,
        lat,
        lng,
      };
    });
  }
}
