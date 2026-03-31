import { PropertyMultimediaRepository } from '../repositories/property-multimedia.repository.js';

export class DeletePropertyMultimediaUseCase {
    constructor(
        private readonly multimediaRepository: PropertyMultimediaRepository
    ) { }

    async execute(id: string): Promise<void> {
        // Buscamos si existe antes de borrar (opcional por seguridad)
        const multimedia = await this.multimediaRepository.findById(id);

        if (multimedia) {
            await this.multimediaRepository.delete(id);
        }
    }
}
