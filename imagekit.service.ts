import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

/**
 * Servicio para gestionar la carga de IMÁGENES a ImageKit.
 */
@Injectable()
export class ImageKitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  /**
   * Sube una imagen a ImageKit.
   * @param file Archivo de Multer.
   * @param fileName Nombre deseado para el archivo.
   */
  async uploadImage(file: Express.Multer.File, fileName: string) {
    try {
      const response = await this.imagekit.upload({
        file: file.buffer, // Buffer del archivo
        fileName: fileName,
        folder: '/propiedades/fotos',
        useUniqueFileName: true,
      });
      return response;
    } catch (error) {
      console.error('Error al subir a ImageKit:', error);
      throw error;
    }
  }
}