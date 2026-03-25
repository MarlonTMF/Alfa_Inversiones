import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerrenoRepositorio } from '../../domain/interfaces/terreno.repositorio.js';
import { PropertyFuenteDatos } from '../../../registro_propiedades/data/fuentes-datos/property.fuente-datos.js';
import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';
import { CrearTerrenoDto } from '../../presentation/dto/crear-terreno.dto.js';

@Injectable()
export class TerrenoRepositorioImpl implements TerrenoRepositorio {
  constructor(
    @InjectRepository(PropertyFuenteDatos)
    private readonly propertyRepo: Repository<PropertyFuenteDatos>,
  ) { }

  async buscarPorBoundingBox(
    bbox: BoundingBoxDto,
  ): Promise<TerrenoRespuestaDto[]> {
    // Usamos QueryBuilder para búsqueda espacial nativa con PostGIS sobre la tabla de propiedades
    const query = this.propertyRepo
      .createQueryBuilder('property')
      .select([
        'property.id',
        'property.name as ubicacion',
        'property.base_price_negotiation as precio',
        'property.total_area as superficie',
        'property.department as departamento',
        'property.status as estado',
        'property.land_use as uso_suelo',
        'ST_AsGeoJSON(property.polygon) as poligono_geojson',
      ]);

    if (bbox.minLng && bbox.minLat && bbox.maxLng && bbox.maxLat) {
      query.where(
        `property.polygon && ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)`,
        {
          minLng: bbox.minLng,
          minLat: bbox.minLat,
          maxLng: bbox.maxLng,
          maxLat: bbox.maxLat,
        },
      );
    }

    const rawProperties = await query.getRawMany();

    return rawProperties.map((raw) => {
      const geojson = raw.poligono_geojson ? JSON.parse(raw.poligono_geojson) : null;
      return {
        id: raw.property_id,
        ubicacion: raw.ubicacion,
        precio: parseFloat(raw.precio),
        superficie: parseFloat(raw.superficie),
        departamento: raw.departamento,
        estado: raw.estado,
        uso_suelo: raw.uso_suelo || 'Uso Mixto',
        poligono: geojson ? geojson.coordinates[0].map((coord: any) => [coord[1], coord[0]]) : [],
      };
    });
  }

  async crear(dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    const existentes = await this.propertyRepo.query(
      'SELECT id FROM properties WHERE id = $1',
      [dto.id],
    );
    if (existentes.length > 0) {
      throw new ConflictException(`La propiedad ${dto.id} ya existe`);
    }

    const puntosWKT = dto.poligono
      .map((p) => `${p[1]} ${p[0]}`)
      .join(', ');
    const wkt = `POLYGON((${puntosWKT}))`;

    await this.propertyRepo.query(
      `INSERT INTO properties (id, name, base_price_negotiation, total_area, polygon, department) 
       VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6)`,
      [dto.id, dto.ubicacion, dto.precio, dto.superficie, wkt, dto.departamento],
    );

    return { mensaje: `Propiedad ${dto.id} registrada exitosamente desde el mapa` };
  }
}
