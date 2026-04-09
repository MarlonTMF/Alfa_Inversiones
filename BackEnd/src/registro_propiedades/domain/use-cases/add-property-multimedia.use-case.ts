import { Injectable, BadRequestException } from '@nestjs/common';
import { PropertyMultimedia } from '../entities/property-multimedia.entity.js';
import { PropertyMultimediaRepository } from '../repositories/property-multimedia.repository.js';

@Injectable()
export class AddPropertyMultimediaUseCase {
    constructor(
        private readonly multimediaRepository: PropertyMultimediaRepository
    ) { }

    async execute(multimediaData: Omit<PropertyMultimedia, 'id' | 'createdAt'>): Promise<PropertyMultimedia> {
        // 1. Validar límite de videos (Negocio: Máximo 4 videos)
        if (multimediaData.type === 'video') {
            const allMultimedia = await this.multimediaRepository.findByPropertyId(multimediaData.propertyId);
            const videoCount = allMultimedia.filter(m => m.type === 'video').length;

            if (videoCount >= 3) {
                throw new BadRequestException('Esta propiedad ya alcanzó el límite máximo de 3 videos.');
            }
        }

        // 2. Generar un ID único (UUID) para el nuevo registro
        const id = crypto.randomUUID();

        // 2. Crear la entidad de dominio con la data recibida
        const newMultimedia = new PropertyMultimedia(
            id,
            multimediaData.propertyId,
            multimediaData.type,
            multimediaData.provider,
            multimediaData.url,
            multimediaData.publicId,
            multimediaData.isMain,
            multimediaData.label,
            undefined,                    // createdAt — lo pone la DB
            (multimediaData as any).thumbnailUrl ?? undefined,
        );

        // 3. Mandar al repositorio para que lo guarde
        return await this.multimediaRepository.save(newMultimedia);
    }
}
