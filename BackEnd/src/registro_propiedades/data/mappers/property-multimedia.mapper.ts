import { PropertyMultimedia } from '../../domain/entities/property-multimedia.entity.js';
import { PropertyMultimediaFuenteDatos } from '../fuentes-datos/property-multimedia.fuente-datos.js';

export class PropertyMultimediaMapper {
    // 1. From Persistence (DB) to Domain (Logic)
    static toDomain(fuente: PropertyMultimediaFuenteDatos): PropertyMultimedia {
        return new PropertyMultimedia(
            fuente.id,
            fuente.propertyId,
            fuente.type as 'photo' | 'video',
            fuente.provider as 'imagekit' | 'cloudinary',
            fuente.url,
            fuente.publicId ?? undefined, // <-- Corrección: si es null, pásalo a undefined
            fuente.isMain,
            fuente.label ?? undefined,    // <-- Corrección: si es null, pásalo a undefined
            fuente.createdAt
        );
    }

    // 2. From Domain (Logic) to Persistence (DB)
    static toPersistence(entidad: PropertyMultimedia): PropertyMultimediaFuenteDatos {
        const fuente = new PropertyMultimediaFuenteDatos();
        fuente.id = entidad.id;
        fuente.propertyId = entidad.propertyId;
        fuente.type = entidad.type;
        fuente.provider = entidad.provider;
        fuente.url = entidad.url;
        fuente.publicId = entidad.publicId ?? undefined; // Aseguramos consistencia
        fuente.isMain = entidad.isMain;
        fuente.label = entidad.label ?? undefined;       // Aseguramos consistencia
        return fuente;
    }
}
