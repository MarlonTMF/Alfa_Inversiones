import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CrearInversionDto {
  @IsString()
  @IsNotEmpty()
  proyectoId: string;

  @IsString()
  @IsNotEmpty()
  inversorId: string;

  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsOptional()
  status?: string;
}
