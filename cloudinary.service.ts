import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

/**
 * Servicio para gestionar la carga de VIDEOS a Cloudinary.
 */
@Injectable()
export class CloudinaryService {
  constructor() {
    // Configuración con la API Key proporcionada por el usuario
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Sube un video (Buffer) a Cloudinary.
   * @param file El archivo proveniente de Multer.
   * @param folder Carpeta de destino en Cloudinary.
   */
  async uploadVideo(
    file: Express.Multer.File,
    folder: string = 'propiedades/videos'
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'video', // Forzado a video para consistencia
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}