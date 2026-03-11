import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('amenidades')
export class AmenidadFuenteDatos {
  @PrimaryColumn()
  id: string;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column('decimal')
  lat: number;

  @Column('decimal')
  lng: number;
}
