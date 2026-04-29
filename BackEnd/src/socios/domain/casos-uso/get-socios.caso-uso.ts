import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SocioFuenteDatos } from '../../data/fuentes-datos/socio.fuente-datos.js';

@Injectable()
export class GetSociosUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async ejecutar(): Promise<SocioFuenteDatos[]> {
    const repository = this.dataSource.getRepository(SocioFuenteDatos);
    // Traemos los socios con la información de usuario relacionada
    return await repository.find({
      relations: ['usuario'],
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }
}
