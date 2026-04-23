import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegistrarSocioDto {
  @IsString()
  @IsNotEmpty()
  nombreEmpresa: string;

  @IsString()
  @IsNotEmpty()
  nit: string;

  @IsString()
  @IsOptional()
  representanteLegal?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  especialidades?: string;

  @IsString()
  @IsOptional()
  maquinaria?: string;

  @IsString()
  @IsNotEmpty()
  passwordGenerado: string;

  @IsString()
  @IsOptional()
  rol?: string = 'constructor';
}
