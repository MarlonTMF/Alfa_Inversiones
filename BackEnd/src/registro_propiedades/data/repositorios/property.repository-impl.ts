import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PropertyRepository } from '../../domain/interfaces/property.repository.js';
import { PropertyFuenteDatos } from '../fuentes-datos/property.fuente-datos.js';

@Injectable()
export class PropertyRepositoryImpl extends PropertyRepository {
  constructor(
    @InjectRepository(PropertyFuenteDatos)
    private readonly repository: Repository<PropertyFuenteDatos>,
  ) {
    super();
  }

  async create(
    property: Partial<PropertyFuenteDatos>,
    manager?: EntityManager,
  ): Promise<PropertyFuenteDatos> {
    const repository = manager
      ? manager.getRepository(PropertyFuenteDatos)
      : this.repository;
    const { polygon, ...rest } = property;

    const newProperty = repository.create(rest);
    const saved = await repository.save(newProperty);

    if (polygon && Array.isArray(polygon) && polygon.length > 0) {
      const wktPoints = polygon.map((p) => `${p[1]} ${p[0]}`).join(', ');
      const wkt = `POLYGON((${wktPoints}))`;

      await repository.query(
        `UPDATE properties SET polygon = ST_GeomFromText($1, 4326) WHERE id = $2`,
        [wkt, saved.id],
      );
    }

    return {
      ...saved,
      polygon: polygon ?? null,
    } as PropertyFuenteDatos;
  }

  async findById(id: string): Promise<PropertyFuenteDatos | null> {
    const result = await this.repository
      .createQueryBuilder('property')
      .select(['property', 'ST_AsGeoJSON(property.polygon) as polygon_geojson'])
      .leftJoinAndSelect('property.legalDocs', 'legalDocs')
      .leftJoinAndSelect('property.trackingSteps', 'trackingSteps')
      .leftJoinAndSelect('property.multimedia', 'multimedia')
      .where('property.id = :id', { id })
      .getRawAndEntities();

    const entity = result.entities[0];
    if (entity && result.raw[0]?.polygon_geojson) {
      entity.polygon = JSON.parse(result.raw[0].polygon_geojson);
    }

    return entity || null;
  }

  async findAll(): Promise<PropertyFuenteDatos[]> {
    const result = await this.repository
      .createQueryBuilder('property')
      .select(['property', 'ST_AsGeoJSON(property.polygon) as polygon_geojson'])
      .leftJoinAndSelect('property.multimedia', 'multimedia')
      .getRawAndEntities();

    return result.entities.map((entity, index) => {
      if (result.raw[index].polygon_geojson) {
        entity.polygon = JSON.parse(result.raw[index].polygon_geojson);
      }
      return entity;
    });
  }

  async addMultimedia(propertyId: string, data: any): Promise<void> {
    await this.repository.query(
      `INSERT INTO property_multimedia (property_id, type, provider, url, public_id, is_main, label)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        propertyId,
        data.type,
        data.provider,
        data.url || data.secure_url,
        data.public_id,
        data.is_main || false,
        data.label || null,
      ],
    );
  }

  async update(id: string, data: Partial<PropertyFuenteDatos>): Promise<void> {
    await this.repository.update(id, data);
  }
}
