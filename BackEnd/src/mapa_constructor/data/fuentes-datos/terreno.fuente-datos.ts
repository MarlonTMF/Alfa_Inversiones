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
  @PrimaryColumn()
  id: string;

  @Column()
  ubicacion: string;

  @Column('decimal')
  precio: number;

  @Column('decimal')
  superficie: number;

  @Column('text')
  poligono_json: string;

  // Campo virtual: se hidrata después de cargar de BD
  poligono: [number, number][];

  @AfterLoad()
  parsearPoligono() {
    this.poligono = JSON.parse(this.poligono_json) as [number, number][];
  }

  @BeforeInsert()
  @BeforeUpdate()
  serializarPoligono() {
    if (this.poligono) {
      this.poligono_json = JSON.stringify(this.poligono);
    }
  }
}
