import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegistrarInversionistaDto {
  @IsString()
  @IsNotEmpty()
  nombreCompleto: string;

  @IsString()
  @IsNotEmpty()
  ciDni: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  profesion?: string;

  @IsString()
  @IsOptional()
  origenFondos?: string;

  @IsString()
  @IsNotEmpty()
  passwordGenerado: string;

  @IsString()
  @IsOptional()
  rol?: string = 'inversor';
}
