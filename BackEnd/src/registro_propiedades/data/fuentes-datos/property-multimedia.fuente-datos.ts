import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PropertyFuenteDatos } from './property.fuente-datos.js';

@Entity('property_multimedia')
export class PropertyMultimediaFuenteDatos {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'property_id', type: 'uuid' })
    propertyId: string;

    @ManyToOne(() => PropertyFuenteDatos, (property) => property.multimedia, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'property_id' })
    property: PropertyFuenteDatos;

    @Column({ type: 'varchar' })
    type: string;

    @Column({ type: 'varchar' })
    provider: string;

    @Column({ type: 'text' })
    url: string;

    @Column({ name: 'public_id', type: 'text', nullable: true })
    publicId?: string | null;

    @Column({ name: 'is_main', type: 'boolean', default: false })
    isMain: boolean;

    @Column({ type: 'varchar', nullable: true })
    label?: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
