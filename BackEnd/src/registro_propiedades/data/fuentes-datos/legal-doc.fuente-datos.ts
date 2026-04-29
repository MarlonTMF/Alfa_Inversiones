import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyFuenteDatos } from './property.fuente-datos.js';

@Entity('legal_docs')
export class LegalDocFuenteDatos {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => PropertyFuenteDatos, (property) => property.legalDocs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyFuenteDatos;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId: string;

  @Column({ name: 'doc_type', type: 'varchar' })
  docType: string;

  @Column({ name: 'file_path', type: 'text', nullable: true })
  filePath: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
