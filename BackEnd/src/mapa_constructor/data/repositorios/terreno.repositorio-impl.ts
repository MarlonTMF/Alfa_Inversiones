import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerrenoRepositorio } from '../../domain/interfaces/terreno.repositorio.js';
import { TerrenoFuenteDatos } from '../fuentes-datos/terreno.fuente-datos.js';
import { BoundingBoxDto } from '../../presentation/dto/bounding-box.dto.js';
import { TerrenoRespuestaDto } from '../../presentation/dto/terreno-respuesta.dto.js';

@Injectable()
export class TerrenoRepositorioImpl implements TerrenoRepositorio {
  constructor(
    @InjectRepository(TerrenoFuenteDatos)
    private readonly terrenoRepo: Repository<TerrenoFuenteDatos>,
  ) {}

  async buscarPorBoundingBox(
    bbox: BoundingBoxDto,
  ): Promise<TerrenoRespuestaDto[]> {
    // En SQLite no hay PostGIS, así que filtramos con lógica en query.
    // Se buscan terrenos donde AL MENOS un vértice del polígono
    // esté dentro del bounding box.
    // Para producción con PostgreSQL+PostGIS, reemplazar con ST_Intersects.
    const terrenos = await this.terrenoRepo.find();

    return terrenos
      .filter((terreno) =>
        terreno.poligono.some(
          ([lat, lng]) =>
            lat >= bbox.minLat &&
            lat <= bbox.maxLat &&
            lng >= bbox.minLng &&
            lng <= bbox.maxLng,
        ),
      )
      .map((terreno) => ({
        id: terreno.id,
        ubicacion: terreno.ubicacion,
        precio: terreno.precio,
        superficie: terreno.superficie,
        poligono: terreno.poligono,
      }));
  }
}
