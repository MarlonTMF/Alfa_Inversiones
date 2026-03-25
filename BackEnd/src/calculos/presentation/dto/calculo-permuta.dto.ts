import { IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CalculoPermutaDto {
  @IsOptional()
  @IsUUID()
  terreno_id?: string;

  @IsOptional()
  @IsUUID()
  property_id?: string;

  @IsOptional()
  @IsNumber()
  costo_suelo?: number;

  @IsOptional()
  @IsNumber()
  precio_venta_unidad?: number;

  @IsOptional()
  @IsNumber()
  ventas_proyectadas?: number;
}
