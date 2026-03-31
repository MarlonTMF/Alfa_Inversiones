import { PropertyMultimedia } from '../entities/property-multimedia.entity.js';

export abstract class PropertyMultimediaRepository {
    abstract save(multimedia: PropertyMultimedia): Promise<PropertyMultimedia>;
    abstract findByPropertyId(propertyId: string): Promise<PropertyMultimedia[]>;
    abstract delete(id: string): Promise<void>;
    abstract findById(id: string): Promise<PropertyMultimedia | null>;
}
