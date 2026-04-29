import { Injectable } from '@nestjs/common';
import ImageKit, { toFile } from '@imagekit/nodejs';

@Injectable()
export class ImageKitService {
  private readonly client: ImageKit;

  constructor() {
    this.client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<{ url: string; fileId: string }> {
    const uploadable = await toFile(file.buffer, fileName, {
      type: file.mimetype,
    });

    const response = await this.client.files.upload({
      file: uploadable,
      fileName,
      folder: '365_properties/multimedia',
    });

    return {
      url: response.url ?? '',
      fileId: response.fileId ?? '',
    };
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.client.files.delete(fileId);
  }
}
