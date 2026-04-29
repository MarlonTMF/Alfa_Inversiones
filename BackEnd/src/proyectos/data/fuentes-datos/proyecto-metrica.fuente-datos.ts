import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from './proyecto.fuente-datos.js';

@Entity('proyecto_metricas')
export class ProyectoMetrica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'proyecto_id' })
  proyectoId: string;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'unidades_vendidas', default: 0 })
  unidadesVendidas: number;

  @Column({ name: 'ingreso_acumulado', type: 'numeric', default: 0 })
  ingresoAcumulado: number;

  @Column({ name: 'costo_acumulado', type: 'numeric', default: 0 })
  costoAcumulado: number;

  @Column({ name: 'roi_actual', type: 'numeric', nullable: true })
  roiActual: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
