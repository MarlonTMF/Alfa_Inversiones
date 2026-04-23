import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';

@Entity('socios')
export class SocioFuenteDatos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @OneToOne(() => UsuarioFuenteDatos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioFuenteDatos;

  @Column()
  nombre_empresa: string;

  @Column({ unique: true })
  nit: string;

  @Column({ nullable: true })
  representante_legal: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  especialidades: string;

  @Column({ type: 'text', nullable: true })
  maquinaria: string;

  @Column({ nullable: true })
  archivo_testimonio_url: string;

  @Column({ nullable: true })
  archivo_padron_url: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fecha_creacion: Date;
}
