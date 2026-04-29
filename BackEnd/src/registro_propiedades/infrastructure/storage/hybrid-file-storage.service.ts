import {
  FileStorageService,
  FileUploadResult,
} from '../../domain/services/file-storage.service.js';
import ImageKit, { toFile } from '@imagekit/nodejs';
import { v2 as cloudinary } from 'cloudinary';

export class HybridFileStorageService extends FileStorageService {
  private imagekit: ImageKit;

  constructor() {
    super();
    this.imagekit = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    type: 'photo' | 'video',
  ): Promise<FileUploadResult> {
    if (type === 'video') {
      return this.uploadToCloudinary(file, fileName);
    } else {
      return this.uploadToImageKit(file, fileName);
    }
  }

  private async uploadToImageKit(
    file: Buffer,
    fileName: string,
  ): Promise<FileUploadResult> {
    try {
      const uploadable = await toFile(file, fileName);
      const response = await this.imagekit.files.upload({
        file: uploadable,
        fileName: fileName,
        folder: '365_properties/photos',
      });

      return {
        url: response.url ?? '',
        publicId: response.fileId ?? '',
        provider: 'imagekit',
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Error en ImageKit: ${msg}`);
    }
  }

  private async uploadToCloudinary(
    file: Buffer,
    fileName: string,
  ): Promise<FileUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: '365_properties/videos', resource_type: 'video' },
        (error, result) => {
          if (error)
            return reject(new Error(`Error en Cloudinary: ${error.message}`));
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            provider: 'cloudinary',
          });
        },
      );
      uploadStream.end(file);
    });
  }

  async deleteFile(
    publicId: string,
    provider: 'imagekit' | 'cloudinary',
  ): Promise<void> {
    if (provider === 'imagekit') {
      await this.imagekit.files.delete(publicId);
    } else {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }
  }
}
