import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from '../../../common/services/imagekit.service.js';
import { CloudinaryService } from '../../../common/services/cloudinary.service.js';
import { AddProyectoMultimediaCasoUso } from '../../domain/use-cases/add-proyecto-multimedia.caso-uso.js';
import { GetProyectoMultimediaCasoUso } from '../../domain/use-cases/get-proyecto-multimedia.caso-uso.js';
import { DeleteProyectoMultimediaCasoUso } from '../../domain/use-cases/delete-proyecto-multimedia.caso-uso.js';
import { SetMainProyectoMultimediaCasoUso } from '../../domain/use-cases/set-main-proyecto-multimedia.caso-uso.js';

@Controller('proyectos/:id/multimedia')
export class ProyectoMultimediaControlador {
  constructor(
    private readonly imageKitService: ImageKitService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly addMultimediaUseCase: AddProyectoMultimediaCasoUso,
    private readonly getMultimediaUseCase: GetProyectoMultimediaCasoUso,
    private readonly deleteMultimediaUseCase: DeleteProyectoMultimediaCasoUso,
    private readonly setMainUseCase: SetMainProyectoMultimediaCasoUso,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  async uploadFiles(
    @Param('id') proyectoId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('category') category?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se ha enviado ningún archivo');
    }

    const uploadPromises = files.map(async (file) => {
      let result;
      let provider: 'imagekit' | 'cloudinary';
      let type: 'photo' | 'video' | 'render' | 'document';

      if (file.mimetype.startsWith('image/')) {
        const upload = await this.imageKitService.uploadFile(
          file,
          `proy-${proyectoId}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        );
        result = { url: upload.url, public_id: upload.fileId };
        provider = 'imagekit';
        // Si la categoría es render, el tipo es render
        type = category === 'render' ? 'render' : 'photo';
      } else if (file.mimetype.startsWith('video/')) {
        const upload = await this.cloudinaryService.uploadVideo(file);
        result = {
          url: (upload as any).secure_url,
          public_id: upload.public_id,
        };
        provider = 'cloudinary';
        type = 'video';
      } else if (file.mimetype === 'application/pdf') {
        const upload = await this.imageKitService.uploadFile(
          file,
          `proy-${proyectoId}-doc-${Date.now()}`,
        );
        result = { url: upload.url, public_id: upload.fileId };
        provider = 'imagekit';
        type = 'document';
      } else {
        return null;
      }

      return await this.addMultimediaUseCase.ejecutar({
        proyectoId,
        type,
        provider,
        url: result.url,
        publicId: result.public_id,
        isMain: false,
        label: file.originalname,
        category: category || 'general',
      });
    });

    const allResults = await Promise.all(uploadPromises);
    const successfulResults = allResults.filter((r) => r !== null);

    return {
      mensaje: `${successfulResults.length} archivo(s) procesado(s)`,
      data: successfulResults,
    };
  }

  @Post('external')
  @HttpCode(HttpStatus.CREATED)
  async addExternalVideo(
    @Param('id') proyectoId: string,
    @Body() body: { url: string; label?: string; category?: string },
  ) {
    if (!body.url) {
      throw new BadRequestException('Se requiere una URL');
    }

    const youtubeMatch = body.url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    if (!youtubeMatch) {
      throw new BadRequestException('La URL no es una URL de YouTube válida');
    }

    const videoId = youtubeMatch[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const saved = await this.addMultimediaUseCase.ejecutar({
      proyectoId,
      type: 'video',
      provider: 'youtube',
      url: embedUrl,
      publicId: videoId,
      isMain: false,
      label: body.label || `Video YouTube ${videoId}`,
      thumbnailUrl,
      category: body.category || 'general',
    });

    return { mensaje: 'Video agregado correctamente', data: saved };
  }

  @Get()
  async getMultimedia(@Param('id') proyectoId: string) {
    return await this.getMultimediaUseCase.ejecutar(proyectoId);
  }

  @Delete(':file_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMultimedia(@Param('file_id') fileId: string) {
    await this.deleteMultimediaUseCase.ejecutar(fileId);
  }

  @Patch(':file_id/main')
  @HttpCode(HttpStatus.OK)
  async setMain(@Param('id') proyectoId: string, @Param('file_id') fileId: string) {
    await this.setMainUseCase.ejecutar(fileId, proyectoId);
    return { mensaje: 'Imagen principal actualizada' };
  }
}
