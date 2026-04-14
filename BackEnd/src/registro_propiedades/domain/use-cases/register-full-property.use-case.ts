import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PropertyRepository } from '../interfaces/property.repository.js';
import type { UsuarioRepositorio } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import { USUARIO_REPOSITORIO } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import { RegisterFullPropertyDto } from '../../presentation/dto/register-full-property.dto.js';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterFullPropertyUseCase {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('PropertyRepository')
    private readonly propertyRepository: PropertyRepository,
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepository: UsuarioRepositorio,
  ) {}

  async execute(dto: RegisterFullPropertyDto): Promise<any> {
    try {
      const geometry = this.parsearPoligono(dto.coordenadas);
      const points = geometry.coordinates[0] as number[][];
      const { centerLat, centerLng } = this.calcularCentroide(points);
      const mappedPolygon = points.map((p: number[]) => [p[1], p[0]]);

      const resultado = await this.dataSource.transaction(async (manager) => {
        let usuario = await this.usuarioRepository.buscarPorEmail(dto.emailPropietario);

        if (!usuario) {
          const hashedPass = await bcrypt.hash(dto.passwordGenerado, 10);
          usuario = await manager.getRepository(UsuarioFuenteDatos).save(
            manager.getRepository(UsuarioFuenteDatos).create({
              id: uuidv4(),
              nombre: dto.nombrePropietario,
              email: dto.emailPropietario,
              password: hashedPass,
              rol: 'propietario-terreno'
            })
          );
        }

        const property = await this.propertyRepository.create({
          id: uuidv4(),
          name: `Terreno - ${dto.nombrePropietario}`,
          category: dto.categoria,
          city: dto.ciudad,
          district: dto.distrito,
          uv: dto.uv,
          zoneBarrio: dto.zona,
          exactAddress: dto.direccion,
          totalArea: dto.superficie,
          frontM: dto.frente,
          backM: dto.fondo,
          basePriceNegotiation: dto.precioBase,
          lat: centerLat,
          lng: centerLng,
          polygon: mappedPolygon,
          status: 'DISPONIBLE',
          creatorId: usuario.id
        }, manager);

        return { usuario, property };
      });

      return {
        mensaje: 'Registro completado con éxito',
        usuario: {
          email: resultado.usuario.email,
          nombre: resultado.usuario.nombre
        },
        propiedadId: resultado.property.id
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error in RegisterFullPropertyUseCase:', error);
      throw new InternalServerErrorException('No se pudo completar el registro del terreno');
    }
  }

  private parsearPoligono(coordenadas: string): { coordinates: number[][][] } {
    let geoJson: any;

    try {
      geoJson = JSON.parse(coordenadas);
    } catch {
      throw new BadRequestException('Las coordenadas no tienen un formato JSON válido');
    }

    const points = geoJson?.coordinates?.[0];
    if (!Array.isArray(points) || points.length < 4) {
      throw new BadRequestException('El polígono debe tener al menos 4 puntos');
    }

    if (!points.every((p: unknown) => Array.isArray(p) && p.length >= 2 && Number.isFinite(Number(p[0])) && Number.isFinite(Number(p[1])))) {
      throw new BadRequestException('El polígono contiene coordenadas inválidas');
    }

    return geoJson;
  }

  private calcularCentroide(points: number[][]): { centerLat: number; centerLng: number } {
    const uniquePoints = points.slice(0, -1);
    if (uniquePoints.length === 0) {
      throw new BadRequestException('No se pudo calcular el centroide del terreno');
    }

    let sumLat = 0;
    let sumLng = 0;

    uniquePoints.forEach((p) => {
      sumLng += Number(p[0]);
      sumLat += Number(p[1]);
    });

    return {
      centerLat: sumLat / uniquePoints.length,
      centerLng: sumLng / uniquePoints.length,
    };
  }
}
