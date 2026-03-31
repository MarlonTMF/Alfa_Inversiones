import { PropertyMultimedia } from '../entities/property-multimedia.entity.js';
import { PropertyMultimediaRepository } from '../repositories/property-multimedia.repository.js';

export class GetPropertyMultimediaUseCase {
    constructor(
        private readonly multimediaRepository: PropertyMultimediaRepository
    ) { }

    async execute(propertyId: string): Promise<PropertyMultimedia[]> {
        // Simplemente le pide al repositorio que busque todas las fotos/videos de ese terreno
        return await this.multimediaRepository.findByPropertyId(propertyId);
    }
}
