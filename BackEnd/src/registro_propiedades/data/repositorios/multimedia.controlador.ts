import { Controller, Post, Get, Delete, Patch, Param, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

    /**
     * Sube múltiples imágenes o videos a la nube (hasta 20 archivos a la vez).
     */
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 20, {
        limits: { fileSize: 100 * 1024 * 1024 }
    }))
    async uploadFiles(
        @Param('id') propertyId: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No se ha enviado ningún archivo');
        }

        // Mapeamos cada archivo a una promesa de subida y guardado para procesar en paralelo
        const uploadPromises = files.map(async (file) => {
            let result;
            let provider: 'imagekit' | 'cloudinary';
            let type: 'photo' | 'video' | 'document';

            if (file.mimetype.startsWith('image/')) {
                const upload = await this.imageKitService.uploadFile(file, `${propertyId}-${Date.now()}-${Math.random().toString(36).substring(7)}`);
                result = { url: upload.url, public_id: upload.fileId };
                provider = 'imagekit';
                type = 'photo';
            } else if (file.mimetype.startsWith('video/')) {
                const upload = await this.cloudinaryService.uploadVideo(file);
                result = { url: (upload as any).secure_url, public_id: upload.public_id };
                provider = 'cloudinary';
                type = 'video';
            } else if (file.mimetype === 'application/pdf') {
                const upload = await this.imageKitService.uploadFile(file, `${propertyId}-doc-${Date.now()}`);
                result = { url: upload.url, public_id: upload.fileId };
                provider = 'imagekit';
                type = 'document';
            } else {
                return null; // Archivo no soportado
            }

            return await this.addMultimediaUseCase.execute({
                propertyId,
                type,
                provider,
                url: result.url,
                publicId: result.public_id,
                isMain: false,
                label: file.originalname
            });
        });

        const allResults = await Promise.all(uploadPromises);
        const successfulResults = allResults.filter(r => r !== null);

        return { 
            mensaje: `${successfulResults.length} archivo(s) procesado(s)`, 
            data: successfulResults 
        };
    }


    /**
     * Guarda una URL externa de YouTube como multimedia de tipo video.
     */
    @Post('external')
    @HttpCode(HttpStatus.CREATED)
    async addExternalVideo(
        @Param('id') propertyId: string,
        @Body() body: { url: string; label?: string }
    ) {
        if (!body.url) {
            throw new BadRequestException('Se requiere una URL');
        }

        // Soportar Shorts y otros formatos comunes de YouTube
        const youtubeMatch = body.url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );

        if (!youtubeMatch) {
            throw new BadRequestException('La URL no es una URL de YouTube válida o formato no soportado');
        }

        const videoId = youtubeMatch[1];
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;


        const saved = await this.addMultimediaUseCase.execute({
            propertyId,
            type: 'video',
            provider: 'youtube',
            url: embedUrl,
            publicId: videoId,
            isMain: false,
            label: body.label || `Video YouTube ${videoId}`,
            thumbnailUrl
        });

        return { mensaje: 'Video de YouTube agregado correctamente', data: saved };
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