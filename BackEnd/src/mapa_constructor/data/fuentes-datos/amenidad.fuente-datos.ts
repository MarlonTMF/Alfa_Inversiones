import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('amenidades')
export class AmenidadFuenteDatos {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordenadas: any;

  @Column({ nullable: true })
  ciudad: string;
}
