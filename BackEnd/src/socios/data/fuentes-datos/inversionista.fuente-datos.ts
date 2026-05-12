import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';

@Entity('inversionistas')
export class InversionistaFuenteDatos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @OneToOne(() => UsuarioFuenteDatos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioFuenteDatos;

  @Column({ unique: true })
  ci_dni: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  profesion: string;

  @Column({ type: 'text', nullable: true })
  origen_fondos: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fecha_creacion: Date;
}
