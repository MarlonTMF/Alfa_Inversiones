import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEmail,
} from 'class-validator';

/**
 * DTO para el registro completo de una propiedad junto con su propietario.
 * Se utiliza para sincronizar el flujo de 3 pasos del frontend.
 */
export class RegisterFullPropertyDto {
  // DATOS DEL PROPIETARIO (PASO 3)
  @IsString()
  @IsNotEmpty()
  nombrePropietario: string;

  @IsEmail()
  @IsNotEmpty()
  emailPropietario: string;

  @IsString()
  @IsNotEmpty()
  telefonoPropietario: string;

  @IsString()
  @IsNotEmpty()
  passwordGenerado: string;

  // DATOS TÉCNICOS (PASO 2)
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsOptional()
  distrito?: string;

  @IsString()
  @IsOptional()
  uv?: string;

  @IsString()
  @IsOptional()
  zona?: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  coordenadas: string; // GeoJSON string del polígono

  @IsNumber()
  @IsNotEmpty()
  superficie: number;

  @IsNumber()
  @IsOptional()
  frente?: number;

  @IsNumber()
  @IsOptional()
  fondo?: number;

  @IsNumber()
  @IsNotEmpty()
  precioBase: number;
}
