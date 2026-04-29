import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('amenidades')
export class AmenidadFuenteDatos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'tipo', type: 'varchar', length: 50 })
  tipo: string;

  @Column({
    name: 'coordenadas',
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordenadas: any;

  @Column({
    name: 'ciudad',
    type: 'varchar',
    length: 100,
    default: 'Cochabamba',
  })
  ciudad: string;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp with time zone',
    nullable: true,
  })
  fecha_creacion: Date;
}
