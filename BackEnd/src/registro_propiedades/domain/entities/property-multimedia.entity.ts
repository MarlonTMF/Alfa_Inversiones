export class PropertyMultimedia {
    constructor(
        public readonly id: string,
        public readonly propertyId: string,
        public readonly type: 'photo' | 'video' | 'document',
        public readonly provider: 'imagekit' | 'cloudinary',
        public readonly url: string,
        public readonly publicId?: string,
        public readonly isMain: boolean = false,
        public readonly label?: string,
        public readonly createdAt?: Date,
    ) { }
}
