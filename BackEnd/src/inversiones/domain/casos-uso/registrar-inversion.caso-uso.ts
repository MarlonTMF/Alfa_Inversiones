import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CrearInversionDto } from '../../presentation/dto/crear-inversion.dto.js';
import { InversionFuenteDatos } from '../../data/fuentes-datos/inversion.fuente-datos.js';
import { ImageKitService } from '../../../common/services/imagekit.service.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegistrarInversionUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly imageKitService: ImageKitService,
  ) {}

  async ejecutar(
    dto: CrearInversionDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let comprobanteUrl: string | undefined = undefined;

      if (file) {
        const res = await this.imageKitService.uploadFile(
          file,
          `comprobante-${dto.inversorId}-${Date.now()}`,
        );
        comprobanteUrl = res.url;
      }

      const inversion = queryRunner.manager.create(InversionFuenteDatos, {
        id: uuidv4(),
        proyecto_id: dto.proyectoId,
        inversor_id: dto.inversorId,
        monto: Number(dto.monto),
        fecha: new Date(dto.fecha),
        comprobante_url: comprobanteUrl,
        status: dto.status || 'pendiente',
      } as any);

      const guardada = await queryRunner.manager.save(
        InversionFuenteDatos,
        inversion,
      );

      await queryRunner.commitTransaction();

      return {
        success: true,
        mensaje: 'Inversión registrada exitosamente',
        data: guardada,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Error en RegistrarInversionUseCase:', err);
      throw new InternalServerErrorException(
        'Error al registrar la inversión: ' + err.message,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
