import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PropertyRepository } from '../interfaces/property.repository.js';
import type { UsuarioRepositorio } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import { USUARIO_REPOSITORIO } from '../../../autenticacion/domain/interfaces/usuario.repositorio.js';
import { RegisterFullPropertyDto } from '../../presentation/dto/register-full-property.dto.js';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { PropertyMultimediaFuenteDatos } from '../../data/fuentes-datos/property-multimedia.fuente-datos.js';
import { LegalDocFuenteDatos } from '../../data/fuentes-datos/legal-doc.fuente-datos.js';
import { ImageKitService } from '../../../common/services/imagekit.service.js';
import { CloudinaryService } from '../../../common/services/cloudinary.service.js';

@Injectable()
export class RegisterFullPropertyUseCase {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('PropertyRepository')
    private readonly propertyRepository: PropertyRepository,
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepository: UsuarioRepositorio,
    private readonly imageKitService: ImageKitService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(dto: RegisterFullPropertyDto, files?: any): Promise<any> {
    try {
      const geometry = this.parsearPoligono(dto.coordenadas);
      const points = geometry.coordinates[0];
      const { centerLat, centerLng } = this.calcularCentroide(points);
      const mappedPolygon = points.map((p: number[]) => [p[1], p[0]]);

      const resultado = await this.dataSource.transaction(async (manager) => {
        let usuario = await this.usuarioRepository.buscarPorEmail(
          dto.emailPropietario,
        );

        if (usuario) {
          throw new ConflictException(
            'Ya existe un usuario registrado con ese correo electrónico',
          );
        }

        const hashedPass = await bcrypt.hash(dto.passwordGenerado, 10);
        usuario = await manager.getRepository(UsuarioFuenteDatos).save(
          manager.getRepository(UsuarioFuenteDatos).create({
            id: uuidv4(),
            nombre: dto.nombrePropietario,
            email: dto.emailPropietario,
            password: hashedPass,
            rol: 'propietario-terreno',
          }),
        );

        const property = await this.propertyRepository.create(
          {
            id: uuidv4(),
            name: this.sanitize(dto.nombrePropietario)
              ? `Terreno - ${dto.nombrePropietario}`
              : 'Terreno Nuevo',
            category: this.sanitize(dto.categoria),
            city: this.sanitize(dto.ciudad),
            district: this.sanitize(dto.distrito),
            uv: this.sanitize(dto.uv),
            zoneBarrio: this.sanitize(dto.zona),
            exactAddress: this.sanitize(dto.direccion),
            totalArea: dto.superficie,
            frontM: dto.frente,
            backM: dto.fondo,
            basePriceNegotiation: dto.precioBase,
            lat: centerLat,
            lng: centerLng,
            polygon: mappedPolygon,
            status: 'DISPONIBLE',
            creatorId: usuario.id,
          },
          manager,
        );

        // --- PROCESAMIENTO DE ARCHIVOS ---

        // 1. Folio Real
        if (files?.folioReal?.[0]) {
          const res = await this.imageKitService.uploadFile(
            files.folioReal[0],
            `folio-${property.id}`,
          );
          await manager.save(LegalDocFuenteDatos, {
            id: uuidv4(),
            propertyId: property.id,
            docType: 'folioReal',
            filePath: res.url,
            status: 'verificado',
          });
        }

        // 2. Catastro
        if (files?.catastro?.[0]) {
          const res = await this.imageKitService.uploadFile(
            files.catastro[0],
            `catastro-${property.id}`,
          );
          await manager.save(LegalDocFuenteDatos, {
            id: uuidv4(),
            propertyId: property.id,
            docType: 'certificadoCatastral',
            filePath: res.url,
            status: 'verificado',
          });
        }

        // 3. Multimedia (Fotos y Videos)
        if (files?.multimedia?.length > 0) {
          let firstMedia = true;
          for (const file of files.multimedia) {
            let res;
            let provider: 'imagekit' | 'cloudinary';
            let type: 'photo' | 'video';

            if (file.mimetype.startsWith('video/')) {
              res = await this.cloudinaryService.uploadVideo(file);
              provider = 'cloudinary';
              type = 'video';
            } else {
              res = await this.imageKitService.uploadFile(
                file,
                `media-${property.id}-${Date.now()}`,
              );
              provider = 'imagekit';
              type = 'photo';
            }

            await manager.save(PropertyMultimediaFuenteDatos, {
              id: uuidv4(),
              propertyId: property.id,
              type,
              provider,
              url: res.url || res.secure_url,
              publicId: res.fileId || res.public_id,
              isMain: firstMedia, // La primera imagen se marca como portada
              label: file.originalname,
            });
            firstMedia = false;
          }
        }

        // 4. Documentación Adicional
        if (files?.adicional?.length > 0) {
          for (const file of files.adicional) {
            const res = await this.imageKitService.uploadFile(
              file,
              `add-${property.id}-${Date.now()}`,
            );
            await manager.save(LegalDocFuenteDatos, {
              id: uuidv4(),
              propertyId: property.id,
              docType: 'adicional',
              filePath: res.url,
              status: 'pendiente',
            });
          }
        }

        return { usuario, property };
      });

      return {
        mensaje: 'Registro completado con éxito',
        usuario: {
          email: resultado.usuario.email,
          nombre: resultado.usuario.nombre,
        },
        propiedadId: resultado.property.id,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Error in RegisterFullPropertyUseCase:', error);
      throw new InternalServerErrorException(
        'No se pudo completar el registro del terreno',
      );
    }
  }

  private parsearPoligono(coordenadas: string): { coordinates: number[][][] } {
    let geoJson: any;

    try {
      geoJson = JSON.parse(coordenadas);
    } catch {
      throw new BadRequestException(
        'Las coordenadas no tienen un formato JSON válido',
      );
    }

    const points = geoJson?.coordinates?.[0];
    if (!Array.isArray(points) || points.length < 4) {
      throw new BadRequestException('El polígono debe tener al menos 4 puntos');
    }

    if (
      !points.every(
        (p: unknown) =>
          Array.isArray(p) &&
          p.length >= 2 &&
          Number.isFinite(Number(p[0])) &&
          Number.isFinite(Number(p[1])),
      )
    ) {
      throw new BadRequestException(
        'El polígono contiene coordenadas inválidas',
      );
    }

    return geoJson;
  }

  private calcularCentroide(points: number[][]): {
    centerLat: number;
    centerLng: number;
  } {
    const uniquePoints = points.slice(0, -1);
    if (uniquePoints.length === 0) {
      throw new BadRequestException(
        'No se pudo calcular el centroide del terreno',
      );
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

  private sanitize(val: any): string | undefined {
    if (val === null || val === undefined) return undefined;
    const str = String(val).trim();
    if (str === '' || str.toLowerCase() === 'null') return undefined;
    return str;
  }
}
