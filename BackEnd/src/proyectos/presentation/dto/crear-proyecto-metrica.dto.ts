import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CrearProyectoMetricaDto {
  @IsDateString()
  fecha: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  unidadesVendidas?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  ingresoAcumulado?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  costoAcumulado?: number;

  @IsNumber()
  @IsOptional()
  roiActual?: number;
}
