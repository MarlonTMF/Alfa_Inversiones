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

  async crear(dto: CrearTerrenoDto): Promise<{ mensaje: string }> {
    const existente = await this.terrenoRepo.findOne({ where: { id: dto.id } });
    if (existente) {
      throw new ConflictException(`El terreno ${dto.id} ya existe`);
    }

    await this.terrenoRepo.save({
      id: dto.id,
      ubicacion: dto.ubicacion,
      precio: dto.precio,
      superficie: dto.superficie,
      poligono_json: JSON.stringify(dto.poligono),
    });

    return { mensaje: `Terreno ${dto.id} registrado exitosamente` };
  }
}
