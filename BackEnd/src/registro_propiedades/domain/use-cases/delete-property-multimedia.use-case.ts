import { Injectable } from '@nestjs/common';
import { PropertyMultimediaRepository } from '../repositories/property-multimedia.repository.js';
import { FileStorageService } from '../services/file-storage.service.js';

@Injectable()
export class DeletePropertyMultimediaUseCase {
  constructor(
    private readonly multimediaRepository: PropertyMultimediaRepository,
    private readonly fileStorage: FileStorageService,
  ) {}

  async execute(id: string): Promise<void> {
    // 1. Buscamos el recurso para obtener el publicId y el proveedor
    const multimedia = await this.multimediaRepository.findById(id);

    if (multimedia && multimedia.publicId) {
      // 2. Borrado físico del proveedor (ImageKit/Cloudinary)
      if (multimedia.provider !== 'youtube') {
        await this.fileStorage.deleteFile(
          multimedia.publicId,
          multimedia.provider as any,
        );
      }

      // 3. Borrado lógico de la base de datos
      await this.multimediaRepository.delete(id);
    }
  }
}
