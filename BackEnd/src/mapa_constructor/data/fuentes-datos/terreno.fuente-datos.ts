import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('terrenos')
export class TerrenoFuenteDatos {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  ubicacion: string;

  @Column({ type: 'varchar', length: 100, default: 'Cochabamba' })
  ciudad: string;

  @Column({ type: 'varchar', nullable: true })
  departamento: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  precio: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  superficie: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Polygon', srid: 4326 })
  poligono: any;

  @Column({ type: 'varchar', length: 20, default: 'disponible' })
  estado: string;

  @Column({ type: 'uuid', nullable: true })
  id_creador: string;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
  fecha_creacion: Date;
}
