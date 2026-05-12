import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InversionistaFuenteDatos } from '../../data/fuentes-datos/inversionista.fuente-datos.js';

@Injectable()
export class GetInversionistasUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async ejecutar(): Promise<InversionistaFuenteDatos[]> {
    const repository = this.dataSource.getRepository(InversionistaFuenteDatos);
    return await repository.find({
      relations: ['usuario'],
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }
}
