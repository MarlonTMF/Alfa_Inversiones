import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PropertyMultimediaRepository } from '../repositories/property-multimedia.repository.js';

@Injectable()
export class SetMainMultimediaUseCase {
  constructor(
    private readonly multimediaRepository: PropertyMultimediaRepository,
  ) {}

  async execute(multimediaId: string): Promise<void> {
    // 1. Buscar el recurso actual para saber a qué propiedad pertenece
    const target = await this.multimediaRepository.findById(multimediaId);

    if (!target) {
      throw new NotFoundException('Recurso multimedia no encontrado');
    }

    // 2. Solo las fotos pueden ser "principales" (opcional, según lógica de negocio)
    if (target.type !== 'photo') {
      throw new BadRequestException(
        'Solo las imágenes pueden ser marcadas como principal',
      );
    }

    // 3. Obtener todos los recursos de la misma propiedad
    const allMultimedia = await this.multimediaRepository.findByPropertyId(
      target.propertyId,
    );

    // 4. Actualizar todos los registros: solo uno será true
    for (const item of allMultimedia) {
      const updatedItem = {
        ...item,
        isMain: item.id === multimediaId,
      };
      await this.multimediaRepository.save(updatedItem);
    }
  }
}
