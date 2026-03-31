export interface FileUploadResult {
    url: string;
    publicId: string;
    provider: 'imagekit' | 'cloudinary';
}

export abstract class FileStorageService {
    abstract uploadFile(file: Buffer, fileName: string, type: 'photo' | 'video'): Promise<FileUploadResult>;
    abstract deleteFile(publicId: string, provider: 'imagekit' | 'cloudinary'): Promise<void>;
}
