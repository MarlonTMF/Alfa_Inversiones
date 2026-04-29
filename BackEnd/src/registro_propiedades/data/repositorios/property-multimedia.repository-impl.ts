import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyMultimediaRepository } from '../../domain/repositories/property-multimedia.repository.js';
import { PropertyMultimedia } from '../../domain/entities/property-multimedia.entity.js';
import { PropertyMultimediaFuenteDatos } from '../fuentes-datos/property-multimedia.fuente-datos.js';
import { PropertyMultimediaMapper } from '../mappers/property-multimedia.mapper.js';

@Injectable()
export class PropertyMultimediaRepositoryImpl extends PropertyMultimediaRepository {
  constructor(
    @InjectRepository(PropertyMultimediaFuenteDatos)
    private readonly repository: Repository<PropertyMultimediaFuenteDatos>,
  ) {
    super();
  }

  async save(multimedia: PropertyMultimedia): Promise<PropertyMultimedia> {
    // 1. Traducimos de Dominio a Persistencia
    const persistenceModel = PropertyMultimediaMapper.toPersistence(multimedia);

    // 2. Guardamos en PostgreSQL usando TypeORM
    const savedModel = await this.repository.save(persistenceModel);

    // 3. Traducimos de vuelta al Dominio para la Lógica de Negocio
    return PropertyMultimediaMapper.toDomain(savedModel);
  }

  async findByPropertyId(propertyId: string): Promise<PropertyMultimedia[]> {
    const results = await this.repository.find({
      where: { propertyId },
      order: { createdAt: 'ASC' },
    });
    return results.map((item) => PropertyMultimediaMapper.toDomain(item));
  }

  async findById(id: string): Promise<PropertyMultimedia | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? PropertyMultimediaMapper.toDomain(result) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
