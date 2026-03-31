import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRepository } from '../../domain/interfaces/property.repository.js';
import { PropertyFuenteDatos } from '../fuentes-datos/property.fuente-datos.js';

/**
 * Implementación concreta del repositorio de propiedades usando TypeORM.
 * Esta clase interactúa directamente con la base de datos.
 */
@Injectable()
export class PropertyRepositoryImpl extends PropertyRepository {
    constructor(
        /**
         * Inyección del repositorio de TypeORM para la entidad PropertyFuenteDatos.
         */
        @InjectRepository(PropertyFuenteDatos)
        private readonly repository: Repository<PropertyFuenteDatos>,
    ) {
        super();
    }

    /**
     * Crea y persiste una nueva propiedad, incluyendo datos espaciales.
     */
    async create(property: Partial<PropertyFuenteDatos>): Promise<PropertyFuenteDatos> {
        // Separamos el polígono si existe para manejarlo con PostGIS
        const { polygon, ...rest } = property;

        // Primero guardamos los datos básicos con TypeORM
        const newProperty = this.repository.create(rest);
        const saved = await this.repository.save(newProperty);

        // Si hay coordenadas de polígono, las insertamos usando ST_GeomFromText (PostGIS)
        if (polygon && Array.isArray(polygon) && polygon.length > 0) {
            const wktPoints = polygon
                .map((p) => `${p[1]} ${p[0]}`) // Convertimos [lat, lng] a "lng lat"
                .join(', ');
            const wkt = `POLYGON((${wktPoints}))`;

            await this.repository.query(
                `UPDATE properties SET polygon = ST_GeomFromText($1, 4326) WHERE id = $2`,
                [wkt, saved.id],
            );
        }

        const found = await this.findById(saved.id);
        if (!found) {
            throw new Error(`Failed to retrieve property ${saved.id} after creation`);
        }
        return found;
    }

    /**
     * Busca una propiedad por su ID, incluyendo sus relaciones y convirtiendo el polígono a GeoJSON.
     */
    async findById(id: string): Promise<PropertyFuenteDatos | null> {
        // Usamos una consulta personalizada para traer el polígono como GeoJSON
        const result = await this.repository
            .createQueryBuilder('property')
            .select([
                'property',
                'ST_AsGeoJSON(property.polygon) as polygon_geojson',
            ])
            .leftJoinAndSelect('property.legalDocs', 'legalDocs')
            .leftJoinAndSelect('property.trackingSteps', 'trackingSteps')
            .leftJoinAndSelect('property.multimedia', 'multimedia')
            .where('property.id = :id', { id })
            .getRawAndEntities();

        const entity = result.entities[0];
        if (entity && result.raw[0].polygon_geojson) {
            entity.polygon = JSON.parse(result.raw[0].polygon_geojson);
        }

        return entity || null;
    }

    /**
     * Lista todas las propiedades registradas.
     */
    /**
     * Lista todas las propiedades registradas, convirtiendo polígonos a GeoJSON.
     */
    async findAll(): Promise<PropertyFuenteDatos[]> {
        const result = await this.repository
            .createQueryBuilder('property')
            .select([
                'property',
                'ST_AsGeoJSON(property.polygon) as polygon_geojson',
            ])
            .leftJoinAndSelect('property.multimedia', 'multimedia')
            .getRawAndEntities();

        return result.entities.map((entity, index) => {
            if (result.raw[index].polygon_geojson) {
                entity.polygon = JSON.parse(result.raw[index].polygon_geojson);
            }
            return entity;
        });
    }

    /**
     * Registra un recurso multimedia usando SQL directo para consistencia con el esquema.
     */
    async addMultimedia(propertyId: string, data: any): Promise<void> {
        await this.repository.query(
            `INSERT INTO property_multimedia (property_id, type, provider, url, public_id, is_main, label)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                propertyId,
                data.type, // 'photo' o 'video'
                data.provider, // 'imagekit' o 'cloudinary'
                data.url || data.secure_url,
                data.public_id,
                data.is_main || false,
                data.label || null
            ]
        );
    }
}
