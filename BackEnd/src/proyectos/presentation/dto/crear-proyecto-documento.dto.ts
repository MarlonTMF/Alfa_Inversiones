import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CrearProyectoDocumentoDto {
  @IsString()
  @MaxLength(80)
  tipo: string;

  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'validado', 'observado'])
  estado?: string;
}
