import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PropertyFuenteDatos } from '../../../registro_propiedades/data/fuentes-datos/property.fuente-datos.js';
import { SocioFuenteDatos } from '../../../socios/data/fuentes-datos/socio.fuente-datos.js';
import { UsuarioFuenteDatos } from '../../../autenticacion/data/fuentes-datos/usuario.fuente-datos.js';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 50, unique: true, nullable: true })
  codigo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'property_id', nullable: true })
  propertyId: string;

  @ManyToOne(() => PropertyFuenteDatos, { nullable: true })
  @JoinColumn({ name: 'property_id' })
  property: PropertyFuenteDatos;

  @Column({ name: 'constructor_id', nullable: true })
  constructorId: string;

  @ManyToOne(() => SocioFuenteDatos, { nullable: true })
  @JoinColumn({ name: 'constructor_id' })
  constructorSocio: SocioFuenteDatos;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin_estimado', type: 'date', nullable: true })
  fechaFinEstimado: Date;

  @Column({ name: 'fecha_fin_real', type: 'date', nullable: true })
  fechaFinReal: Date;

  @Column({ length: 50, default: 'planificacion' })
  estado: string;

  @Column({ name: 'costo_terreno', type: 'numeric', nullable: true })
  costoTerreno: number;

  @Column({ name: 'costo_construccion', type: 'numeric', nullable: true })
  costoConstruccion: number;

  @Column({ name: 'presupuesto_total', type: 'numeric', nullable: true })
  presupuestoTotal: number;

  @Column({ name: 'precio_venta_estimado', type: 'numeric', nullable: true })
  precioVentaEstimado: number;

  @Column({ name: 'precio_unitario', type: 'numeric', nullable: true })
  precioUnitario: number;

  @Column({ name: 'precio_venta_total', type: 'numeric', nullable: true })
  precioVentaTotal: number;

  @Column({ name: 'costo_indirectos', type: 'numeric', nullable: true })
  costoIndirectos: number;

  @Column({ name: 'costo_marketing', type: 'numeric', nullable: true })
  costoMarketing: number;

  @Column({ name: 'costo_permisos', type: 'numeric', nullable: true })
  costoPermisos: number;

  @Column({ name: 'costo_financiero', type: 'numeric', nullable: true })
  costoFinanciero: number;

  @Column({ name: 'contingencia', type: 'numeric', nullable: true })
  contingencia: number;

  @Column({ name: 'area_construccion_m2', type: 'numeric', nullable: true })
  areaConstruccionM2: number;

  @Column({ name: 'tasa_descuento', type: 'numeric', nullable: true })
  tasaDescuento: number;

  @Column({ name: 'flujo_caja', type: 'jsonb', nullable: true })
  flujoCaja: any;

  @Column({ type: 'numeric', nullable: true })
  roi: number;

  @Column({ name: 'margen_utilidad', type: 'numeric', nullable: true })
  margenUtilidad: number;

  @Column({ name: 'velocidad_venta', type: 'numeric', nullable: true })
  velocidadVenta: number;

  @Column({ name: 'incidencia_terreno', type: 'numeric', nullable: true })
  incidenciaTerreno: number;

  @Column({ name: 'numero_niveles', nullable: true })
  numeroNiveles: number;

  @Column({ name: 'numero_unidades', nullable: true })
  numeroUnidades: number;

  @Column({ name: 'tipo_proyecto', length: 50, nullable: true })
  tipoProyecto: string;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: string;

  @ManyToOne(() => UsuarioFuenteDatos, { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: UsuarioFuenteDatos;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
