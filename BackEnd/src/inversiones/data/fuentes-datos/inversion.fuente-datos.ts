import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from '../../../proyectos/data/fuentes-datos/proyecto.fuente-datos.js';
import { InversionistaFuenteDatos } from '../../../socios/data/fuentes-datos/inversionista.fuente-datos.js';

@Entity('inversiones')
export class InversionFuenteDatos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp with time zone' })
  fecha: Date;

  @Column({ nullable: true })
  comprobante_url: string;

  @Column({ default: 'pendiente' })
  status: string; // pendiente, aprobado, rechazado

  @Column()
  proyecto_id: string;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @Column()
  inversor_id: string;

  @ManyToOne(() => InversionistaFuenteDatos)
  @JoinColumn({ name: 'inversor_id' })
  inversor: InversionistaFuenteDatos;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fecha_registro: Date;
}
