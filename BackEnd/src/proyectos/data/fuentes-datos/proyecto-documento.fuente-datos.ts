import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.fuente-datos.js';

@Entity('proyecto_documentos')
export class ProyectoDocumento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @Column({ length: 80 })
  tipo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ length: 30, default: 'pendiente' })
  estado: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
