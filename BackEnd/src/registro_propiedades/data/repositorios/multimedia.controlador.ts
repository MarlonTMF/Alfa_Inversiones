import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from '../../../common/services/imagekit.service.js';
import { CloudinaryService } from '../../../common/services/cloudinary.service.js';
import { PropertyRepository } from '../../domain/interfaces/property.repository.js';

@Controller('propiedades/:id/multimedia')
export class MultimediaControlador {
    constructor(
        private readonly imageKitService: ImageKitService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly propertyRepo: PropertyRepository,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('id') propertyId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No se ha enviado ningún archivo');
        }

        let result;
        let provider: 'imagekit' | 'cloudinary';
        let type: 'photo' | 'video';

        // Lógica de decisión según el tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            // Usar ImageKit para imágenes
            const upload = await this.imageKitService.uploadImage(file, `${propertyId}-${Date.now()}`);
            result = {
                url: upload.url,
                public_id: upload.fileId,
            };
            provider = 'imagekit';
            type = 'photo';
        } else if (file.mimetype.startsWith('video/')) {
            // Usar Cloudinary para videos
            const upload = await this.cloudinaryService.uploadVideo(file);
            result = {
                url: (upload as any).secure_url,
                public_id: upload.public_id,
            };
            provider = 'cloudinary';
            type = 'video';
        } else {
            throw new BadRequestException('Formato de archivo no soportado. Use imágenes o videos.');
        }

        // Guardar en la base de datos usando el repositorio
        await this.propertyRepo.addMultimedia(propertyId, {
            type,
            provider,
            url: result.url,
            public_id: result.public_id,
            is_main: false,
            label: file.originalname
        });

        return {
            mensaje: `Archivo subido con éxito a ${provider}`,
            data: result
        };
    }
}