import { IsString, IsIn, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CalculoViabilidadDto {
  @IsString()
  @IsIn(['constructor', 'inversionista'])
  rol: 'constructor' | 'inversionista';

  @IsOptional()
  @IsUUID()
  terreno_id?: string;

  @IsOptional()
  @IsUUID()
  property_id?: string;

  // -- Parámetros Financieros Base (Sobrescriben BD si se envían) --
  @IsOptional()
  @IsNumber()
  costo_suelo?: number;

  // -- Específicos para Constructor --
  @IsOptional()
  @IsNumber()
  ventas_proyectadas?: number;

  @IsOptional()
  @IsNumber()
  costo_construccion?: number;

  // -- Específicos para Inversionista --
  @IsOptional()
  @IsNumber()
  ticket_inversion?: number;

  @IsOptional()
  @IsNumber()
  flujo_anual_proyectado?: number;
}
