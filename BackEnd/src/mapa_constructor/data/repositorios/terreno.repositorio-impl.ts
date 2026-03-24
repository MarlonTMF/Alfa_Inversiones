import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerrenoRepositorio } from '../../domain/interfaces/terreno.repositorio.js';
import { TerrenoFuenteDatos } from '../fuentes-datos/terreno.fuente-datos.js';
import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';
import { CrearTerrenoDto } from '../../presentation/dto/crear-terreno.dto.js';

@Injectable()
export class TerrenoRepositorioImpl implements TerrenoRepositorio {
  constructor(
    @InjectRepository(TerrenoFuenteDatos)
    private readonly terrenoRepo: Repository<TerrenoFuenteDatos>,
  ) {}

  async buscarPorBoundingBox(
    bbox: BoundingBoxDto,
  ): Promise<TerrenoRespuestaDto[]> {
    // Usamos QueryBuilder para recuperar la geometría limpia en formato GeoJSON mediante PostGIS
    const rawTerrenos = await this.terrenoRepo.createQueryBuilder('terreno')
      .select([
        'terreno.id AS id',
        'terreno.ubicacion AS ubicacion',
        'terreno.precio AS precio',
        'terreno.superficie AS superficie',
      ])
      .addSelect('ST_AsGeoJSON(terreno.poligono)', 'poligono_geojson')
      .getRawMany();

    const terrenosMapeados = rawTerrenos.map((row) => {
      let poligonoLeaflet: [number, number][] = [];
      if (row.poligono_geojson) {
        const geojson = JSON.parse(row.poligono_geojson);
        // GeoJSON es [[[lng, lat], [lng, lat]...]]
        // Leaflet espera [[lat, lng], [lat, lng]...]
        if (geojson.coordinates && geojson.coordinates[0]) {
          poligonoLeaflet = geojson.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
        }
      }
      return {
        id: row.id,
        ubicacion: row.ubicacion,
        precio: Number(row.precio),
        superficie: Number(row.superficie),
        poligono: poligonoLeaflet,
      };
    });

    // Si no se envían coordenadas de bbox (ej. desde Postman sin params), devolvemos todo.
    if (!bbox.minLat || !bbox.maxLat || !bbox.minLng || !bbox.maxLng) {
      return terrenosMapeados;
    }

    // Filtro original basado en Bounding Box mantenido para compatibilidad con código existente
    return terrenosMapeados.filter((terreno) =>
      terreno.poligono.some(
        ([lat, lng]) =>
          lat >= Number(bbox.minLat) &&
          lat <= Number(bbox.maxLat) &&
          lng >= Number(bbox.minLng) &&
          lng <= Number(bbox.maxLng),
      ),
    );
  }

  async crear(dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    const existente = await this.terrenoRepo.findOne({ where: { codigo: dto.id } });
    if (existente) {
      throw new ConflictException(`El terreno ${dto.id} ya existe`);
    }

    // Convertir el formato Leaflet [[lat, lng]] a GeoJSON Polygon
    const coordinates = dto.poligono.map(([lat, lng]) => [lng, lat]);
    // Asegurar que el anillo esté cerrado (primer y último punto idénticos)
    if (
      coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1]
    ) {
      coordinates.push([coordinates[0][0], coordinates[0][1]]);
    }

    const poligonoGeoJson = {
      type: 'Polygon',
      coordinates: [coordinates],
    };

    // El DTO trae un id en formato string corto ("T-NUEVO-001"). 
    // Como la BD usa UUID autogenerado como PK, guardaremos este string en la columna 'codigo'.
    await this.terrenoRepo.query(
      `INSERT INTO terrenos (codigo, ubicacion, precio, superficie, poligono)
       VALUES ($1, $2, $3, $4, ST_SetSRID(ST_GeomFromGeoJSON($5), 4326))`,
      [dto.id, dto.ubicacion, dto.precio, dto.superficie, JSON.stringify(poligonoGeoJson)]
    );

    return { mensaje: `Terreno ${dto.id} registrado exitosamente` };
  }
}
