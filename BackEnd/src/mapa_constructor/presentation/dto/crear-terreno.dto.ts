import {
  IsString,
  IsNumber,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class CrearTerrenoDto {
  @IsString()
  id: string;

  @IsString()
  ubicacion: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  superficie: number;

  @IsArray()
  @ArrayMinSize(3)
  poligono: [number, number][];

  @IsOptional()
  @IsString()
  documentos_metadata?: string;

  @IsOptional()
  @IsString()
  departamento?: string;
}
