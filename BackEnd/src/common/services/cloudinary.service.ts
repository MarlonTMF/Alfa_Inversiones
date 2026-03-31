import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadVideo(
        file: Express.Multer.File,
    ): Promise<{ secure_url: string; public_id: string }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: '365_properties/videos', resource_type: 'video' },
                (error, result) => {
                    if (error || !result) {
                        return reject(
                            new Error(
                                `Error en Cloudinary: ${error?.message ?? 'resultado vacío'}`,
                            ),
                        );
                    }
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                },
            );
            uploadStream.end(file.buffer);
        });
    }

    async deleteVideo(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }
}
