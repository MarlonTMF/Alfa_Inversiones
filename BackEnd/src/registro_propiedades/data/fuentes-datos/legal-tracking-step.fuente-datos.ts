import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PropertyFuenteDatos } from './property.fuente-datos.js';

@Entity('legal_tracking_steps')
export class LegalTrackingStepFuenteDatos {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => PropertyFuenteDatos, (property) => property.trackingSteps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'property_id' })
    property: PropertyFuenteDatos;

    @Column({ name: 'property_id', type: 'uuid' })
    propertyId: string;

    @Column({ type: 'varchar', nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'integer', nullable: true })
    progress: number;

    @Column({ name: 'estimated_date', type: 'varchar', nullable: true })
    estimatedDate: string;

    @Column({ type: 'varchar', nullable: true })
    status: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
