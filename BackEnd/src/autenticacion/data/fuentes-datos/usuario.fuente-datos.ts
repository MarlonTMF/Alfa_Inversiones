import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class UsuarioFuenteDatos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  rol: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
