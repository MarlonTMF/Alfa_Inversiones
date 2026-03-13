import {
  Entity,
  PrimaryColumn,
  Column,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('terrenos')
export class TerrenoFuenteDatos {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  ubicacion: string;

  @Column('decimal', { precision: 15, scale: 2 })
  precio: number;

  @Column('decimal', { precision: 10, scale: 2 })
  superficie: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  poligono: any;

  @Column()
  estado: string;

  @Column({ nullable: true })
  codigo: string;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ nullable: true })
  departamento: string;
}
