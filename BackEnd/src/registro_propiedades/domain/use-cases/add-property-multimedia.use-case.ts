import { PropertyMultimedia } from '../entities/property-multimedia.entity.js';
import { PropertyMultimediaRepository } from '../repositories/property-multimedia.repository.js';

export class AddPropertyMultimediaUseCase {
    constructor(
        private readonly multimediaRepository: PropertyMultimediaRepository
    ) { }

    async execute(multimediaData: Omit<PropertyMultimedia, 'id' | 'createdAt'>): Promise<PropertyMultimedia> {
        // 1. Generar un ID único (UUID) para el nuevo registro
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
            multimediaData.label
        );

        // 3. Mandar al repositorio para que lo guarde
        return await this.multimediaRepository.save(newMultimedia);
    }
}
