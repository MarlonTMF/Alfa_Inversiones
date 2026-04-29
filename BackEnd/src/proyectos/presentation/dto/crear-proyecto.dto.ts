import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

export class CrearProyectoDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  constructorId?: string;

  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @IsString()
  @IsOptional()
  fechaFinEstimado?: string;

  @IsString()
  @IsOptional()
  fechaFinReal?: string;

  @IsString()
  @IsOptional()
  @IsIn([
    'planificacion',
    'en_construccion',
    'en_venta',
    'completado',
    'suspendido',
  ])
  estado?: string;

  @IsNumber()
  @IsOptional()
  costoTerreno?: number;

  @IsNumber()
  @IsOptional()
  costoConstruccion?: number;

  @IsNumber()
  @IsOptional()
  presupuestoTotal?: number;

  @IsNumber()
  @IsOptional()
  precioVentaEstimado?: number;

  @IsNumber()
  @IsOptional()
  precioUnitario?: number;

  @IsNumber()
  @IsOptional()
  precioVentaTotal?: number;

  @IsNumber()
  @IsOptional()
  costoIndirectos?: number;

  @IsNumber()
  @IsOptional()
  costoMarketing?: number;

  @IsNumber()
  @IsOptional()
  costoPermisos?: number;

  @IsNumber()
  @IsOptional()
  costoFinanciero?: number;

  @IsNumber()
  @IsOptional()
  contingencia?: number;

  @IsNumber()
  @IsOptional()
  areaConstruccionM2?: number;

  @IsNumber()
  @IsOptional()
  tasaDescuento?: number;

  @IsOptional()
  flujoCaja?: any;

  @IsNumber()
  @IsOptional()
  roi?: number;

  @IsNumber()
  @IsOptional()
  margenUtilidad?: number;

  @IsNumber()
  @IsOptional()
  velocidadVenta?: number;

  @IsNumber()
  @IsOptional()
  incidenciaTerreno?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  numeroNiveles?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  numeroUnidades?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  tipoProyecto?: string;
}
