import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.fuente-datos.js';

@Entity('proyecto_multimedia')
export class ProyectoMultimedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @Column({ type: 'varchar', length: 50 })
  type: string; // 'photo', 'video', 'render', '3d_model', 'document'

  @Column({ type: 'varchar', length: 50 })
  provider: string; // 'imagekit', 'cloudinary', 'youtube'

  @Column({ type: 'text' })
  url: string;

  @Column({ name: 'public_id', type: 'text', nullable: true })
  publicId?: string;

  @Column({ name: 'is_main', type: 'boolean', default: false })
  isMain: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label?: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category?: string; // 'render', 'progress', 'legal', etc.

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
