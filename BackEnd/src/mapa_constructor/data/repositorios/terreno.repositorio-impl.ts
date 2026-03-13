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
  ) { }

  async buscarPorBoundingBox(
    bbox: BoundingBoxDto,
  ): Promise<TerrenoRespuestaDto[]> {
    // Usamos QueryBuilder para búsqueda espacial nativa con PostGIS
    const query = this.terrenoRepo
      .createQueryBuilder('terreno')
      .select([
        'terreno.id',
        'terreno.ubicacion',
        'terreno.precio',
        'terreno.superficie',
        'terreno.departamento',
        'ST_AsGeoJSON(terreno.poligono) as poligono_geojson',
      ]);

    // Si los bounds son válidos, filtramos por área. Si no, traemos todo.
    if (bbox.minLng && bbox.minLat && bbox.maxLng && bbox.maxLat) {
      query.where(
        `terreno.poligono && ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326)`,
        {
          minLng: bbox.minLng,
          minLat: bbox.minLat,
          maxLng: bbox.maxLng,
          maxLat: bbox.maxLat,
        },
      );
    }

    const rawTerrenos = await query.getRawMany();

    return rawTerrenos.map((raw) => {
      const geojson = JSON.parse(raw.poligono_geojson);
      return {
        id: raw.terreno_id,
        ubicacion: raw.terreno_ubicacion,
        precio: parseFloat(raw.terreno_precio),
        superficie: parseFloat(raw.terreno_superficie),
        departamento: raw.terreno_departamento,
        poligono: geojson.coordinates[0].map((coord: any) => [coord[1], coord[0]]),
      };
    });
  }

  async crear(dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    const existentes = await this.terrenoRepo.query(
      'SELECT id FROM terrenos WHERE id = $1',
      [dto.id],
    );
    if (existentes.length > 0) {
      throw new ConflictException(`El terreno ${dto.id} ya existe`);
    }

    // Para la creación usamos raw SQL para manejar ST_GeomFromText fácilmente
    const puntosWKT = dto.poligono
      .map((p) => `${p[1]} ${p[0]}`) // Convertimos [lat, lng] a "lng lat" para WKT
      .join(', ');
    const wkt = `POLYGON((${puntosWKT}))`;

    await this.terrenoRepo.query(
      `INSERT INTO terrenos (id, ubicacion, precio, superficie, poligono, departamento) 
       VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6)`,
      [dto.id, dto.ubicacion, dto.precio, dto.superficie, wkt, dto.departamento],
    );

    return { mensaje: `Terreno ${dto.id} registrado exitosamente` };
  }
}
