import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.fuente-datos.js';
import { ProyectoFase } from './proyecto-fase.fuente-datos.js';

@Entity('proyecto_avances')
export class ProyectoAvance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @Column({ name: 'fase_id', nullable: true })
  faseId: string;

  @ManyToOne(() => ProyectoFase, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fase_id' })
  fase: ProyectoFase;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ name: 'porcentaje_avance', type: 'numeric', default: 0 })
  porcentajeAvance: number;

  @Column({ name: 'fecha_reporte', type: 'date', nullable: true })
  fechaReporte: Date;

  @Column({ type: 'jsonb', nullable: true })
  multimedia: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
