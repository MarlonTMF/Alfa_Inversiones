import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

export class CrearProyectoFaseDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsInt()
  orden: number;

  @IsString()
  @IsOptional()
  fechaInicioEstimada?: string;

  @IsString()
  @IsOptional()
  fechaFinEstimada?: string;

  @IsString()
  @IsOptional()
  fechaInicioReal?: string;

  @IsString()
  @IsOptional()
  fechaFinReal?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  progreso?: number;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'en_progreso', 'completada', 'bloqueada'])
  estado?: string;
}
