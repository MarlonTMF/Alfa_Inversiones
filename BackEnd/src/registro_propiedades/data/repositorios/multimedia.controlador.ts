import { Controller, Post, Get, Delete, Patch, Param, UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from '../../../common/services/imagekit.service.js';
import { CloudinaryService } from '../../../common/services/cloudinary.service.js';
import { AddPropertyMultimediaUseCase } from '../../domain/use-cases/add-property-multimedia.use-case.js';
import { GetPropertyMultimediaUseCase } from '../../domain/use-cases/get-property-multimedia.use-case.js';
import { DeletePropertyMultimediaUseCase } from '../../domain/use-cases/delete-property-multimedia.use-case.js';
import { SetMainMultimediaUseCase } from '../../domain/use-cases/set-main-multimedia.use-case.js';

@Controller('propiedades/:id/multimedia')
export class MultimediaControlador {
    constructor(
        private readonly imageKitService: ImageKitService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly addMultimediaUseCase: AddPropertyMultimediaUseCase,
        private readonly getMultimediaUseCase: GetPropertyMultimediaUseCase,
        private readonly deleteMultimediaUseCase: DeletePropertyMultimediaUseCase,
        private readonly setMainUseCase: SetMainMultimediaUseCase,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        limits: { fileSize: 100 * 1024 * 1024 } // Límite de 100MB
    }))
    async uploadFile(
        @Param('id') propertyId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No se ha enviado ningún archivo');
        }

        let result;
        let provider: 'imagekit' | 'cloudinary';
        let type: 'photo' | 'video' | 'document';

        // Lógica de decisión según el tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            // Usar ImageKit para imágenes
            const upload = await this.imageKitService.uploadFile(file, `${propertyId}-${Date.now()}`);
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
        } else if (file.mimetype === 'application/pdf') {
            // Usar ImageKit para PDFs
            const upload = await this.imageKitService.uploadFile(file, `${propertyId}-doc-${Date.now()}`);
            result = {
                url: upload.url,
                public_id: upload.fileId,
            };
            provider = 'imagekit';
            type = 'document';
        } else {
            throw new BadRequestException('Formato de archivo no soportado. Use imágenes, videos o PDF.');
        }

        // 3. Delegar el guardado al Caso de Uso (Arquitectura Limpia)
        const saved = await this.addMultimediaUseCase.execute({
            propertyId,
            type,
            provider,
            url: result.url,
            publicId: result.public_id,
            isMain: false,
            label: file.originalname
        });

        return {
            mensaje: `Archivo subido con éxito a ${provider}`,
            data: saved
        };
    }

    @Get()
    async getMultimedia(@Param('id') propertyId: string) {
        return await this.getMultimediaUseCase.execute(propertyId);
    }

    @Delete(':file_id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMultimedia(@Param('file_id') fileId: string) {
        await this.deleteMultimediaUseCase.execute(fileId);
    }

    @Patch(':file_id/main')
    @HttpCode(HttpStatus.OK)
    async setMain(@Param('file_id') fileId: string) {
        await this.setMainUseCase.execute(fileId);
        return { mensaje: 'Imagen principal actualizada correctamente' };
    }
}