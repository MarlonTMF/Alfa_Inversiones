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
    // Usamos QueryBuilder para búsqueda espacial nativa con PostGIS sobre la tabla de propiedades (UNIFICADA)
    const query = this.propertyRepo
      .createQueryBuilder('property')
      .select([
        'property.id as id',
        'property.name as ubicacion',
        'property.base_price_negotiation as precio',
        'property.total_area as superficie',
        'property.department as departamento',
        'property.status as estado',
        'property.land_use as uso_suelo',
        'ST_AsGeoJSON(property.polygon) as poligono_geojson',
      ]);

    // Búsqueda espacial eficiente por Bounding Box (Overlap &&)
    // También filtramos para que NO devuelva propiedades con polígono NULL
    query.andWhere('property.polygon IS NOT NULL');

    if (bbox.minLng && bbox.minLat && bbox.maxLng && bbox.maxLat) {
      query.andWhere(
        `property.polygon && ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)`,
        {
          minLng: Number(bbox.minLng),
          minLat: Number(bbox.minLat),
          maxLng: Number(bbox.maxLng),
          maxLat: Number(bbox.maxLat),
        },
      );
    }

    const rawProperties = await query.getRawMany();

    return rawProperties.map((raw) => {
      let coordinates: [number, number][] = [];
      
      if (raw.poligono_geojson) {
        const geojson = JSON.parse(raw.poligono_geojson);
        if (geojson.coordinates && geojson.coordinates[0]) {
          coordinates = geojson.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
        }
      }

      return {
        id: raw.id,
        ubicacion: raw.ubicacion,
        precio: Number(raw.precio),
        superficie: Number(raw.superficie),
        departamento: raw.departamento,
        estado: raw.estado,
        uso_suelo: raw.uso_suelo || 'Uso Mixto',
        poligono: coordinates,
      };
    });



  }

  async crear(dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    // Verificar si ya existe en la tabla unificada
    const existentes = await this.propertyRepo.query(
      'SELECT id FROM properties WHERE id = $1',
      [dto.id],
    );
    if (existentes.length > 0) {
      throw new ConflictException(`La propiedad ${dto.id} ya existe`);
    }

    // Convertir polígono Leaflet [[lat, lng]] a WKT POLYGON((lng lat, ...))
    const puntosWKT = dto.poligono
      .map((p) => `${p[1]} ${p[0]}`)
      .join(', ');

    // Asegurar que el polígono esté cerrado para WKT
    const primerPunto = `${dto.poligono[0][1]} ${dto.poligono[0][0]}`;
    const ultimoPunto = `${dto.poligono[dto.poligono.length - 1][1]} ${dto.poligono[dto.poligono.length - 1][0]}`;
    const wktData = primerPunto === ultimoPunto ? puntosWKT : `${puntosWKT}, ${primerPunto}`;

    const wkt = `POLYGON((${wktData}))`;

    // Inserción directa en la tabla unificada properties
    await this.propertyRepo.query(
      `INSERT INTO properties (id, name, base_price_negotiation, total_area, polygon, department, status, land_use) 
       VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6, $7, $8)`,
      [
        dto.id,
        dto.ubicacion,
        dto.precio,
        dto.superficie,
        wkt,
        dto.departamento,
        'disponible',
        dto.uso_suelo || 'Uso Mixto'
      ],
    );

    return { mensaje: `Propiedad ${dto.id} registrada exitosamente en la tabla unificada` };
  }
}
