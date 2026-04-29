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

@Entity('proyecto_fases')
export class ProyectoFase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  orden: number;

  @Column({ name: 'fecha_inicio_estimada', type: 'date', nullable: true })
  fechaInicioEstimada: Date;

  @Column({ name: 'fecha_fin_estimada', type: 'date', nullable: true })
  fechaFinEstimada: Date;

  @Column({ name: 'fecha_inicio_real', type: 'date', nullable: true })
  fechaInicioReal: Date;

  @Column({ name: 'fecha_fin_real', type: 'date', nullable: true })
  fechaFinReal: Date;

  @Column({ default: 0 })
  progreso: number;

  @Column({ length: 50, default: 'pendiente' })
  estado: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
