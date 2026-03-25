import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { LegalDocFuenteDatos } from './legal-doc.fuente-datos.js';
import { LegalTrackingStepFuenteDatos } from './legal-tracking-step.fuente-datos.js';

@Entity('properties')
export class PropertyFuenteDatos {
    @PrimaryColumn('uuid')
    id: string;

    // DATOS GENERALES
    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    category: string;

    @Column({ type: 'varchar', nullable: true })
    status: string;

    // UBICACIÓN
    @Column({ type: 'varchar', nullable: true })
    city: string;

    @Column({ type: 'varchar', nullable: true })
    district: string;

    @Column({ type: 'varchar', nullable: true })
    uv: string;

    @Column({ name: 'zone_barrio', type: 'varchar', nullable: true })
    zoneBarrio: string;

    @Column({ name: 'exact_address', type: 'text', nullable: true })
    exactAddress: string;

    @Column({ type: 'double precision', nullable: true })
    lat: number;

    @Column({ type: 'double precision', nullable: true })
    lng: number;

    // DIMENSIONES
    @Column({ name: 'total_area', type: 'numeric', nullable: true })
    totalArea: number;

    @Column({ name: 'front_m', type: 'numeric', nullable: true })
    frontM: number;

    @Column({ name: 'back_m', type: 'numeric', nullable: true })
    backM: number;

    // VALORACIÓN
    @Column({ name: 'price_per_m2', type: 'numeric', nullable: true })
    pricePerM2: number;

    @Column({ name: 'base_price_negotiation', type: 'numeric', nullable: true })
    basePriceNegotiation: number;

    // EDIFICABILIDAD Y RETORNO
    @Column({ name: 'allowed_floors', type: 'integer', nullable: true })
    allowedFloors: number;

    @Column({ name: 'buildability_index', type: 'numeric', nullable: true })
    buildabilityIndex: number;

    @Column({ name: 'projected_roi', type: 'numeric', nullable: true })
    projectedRoi: number;

    @Column({ name: 'land_incidence', type: 'numeric', nullable: true })
    landIncidence: number;

    // DETALLES ADICIONALES
    @Column({ name: 'construction_cost_sqm', type: 'numeric', nullable: true })
    constructionCostSqm: number;

    @Column({ name: 'sales_cycle_months', type: 'integer', nullable: true })
    salesCycleMonths: number;

    @Column({ name: 'max_height_verified', type: 'boolean', nullable: true })
    maxHeightVerified: boolean;

    @Column({ name: 'development_type', type: 'varchar', nullable: true })
    developmentType: string;

    @Column({ name: 'finish_quality', type: 'varchar', nullable: true })
    finishQuality: string;

    @Column({ name: 'advisor_vision', type: 'text', nullable: true })
    advisorVision: string;

    // FECHAS
    @Column({ name: 'created_at', type: 'timestamp with time zone', nullable: true })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone', nullable: true })
    updatedAt: Date;

    // CAMPOS ESPACIALES (Para el Mapa)
    @Column({
        type: 'geometry',
        spatialFeatureType: 'Polygon',
        srid: 4326,
        nullable: true,
    })
    polygon: any;

    @Column({ name: 'land_use', type: 'varchar', nullable: true, default: 'Uso Mixto' })
    landUse: string;

    @Column({ type: 'varchar', nullable: true })
    department: string;

    @Column({ type: 'varchar', nullable: true })
    code: string;

    // RELACIONES
    @OneToMany(() => LegalDocFuenteDatos, (doc) => doc.property, { cascade: true })
    legalDocs: LegalDocFuenteDatos[];

    @OneToMany(() => LegalTrackingStepFuenteDatos, (step) => step.property, { cascade: true })
    trackingSteps: LegalTrackingStepFuenteDatos[];
}
