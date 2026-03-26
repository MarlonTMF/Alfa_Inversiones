import { IsString, IsIn } from 'class-validator';

export class EstadoProyectoDto {
  @IsString()
  // Validamos los estados del embudo estándar que usarán frontend/backend
  @IsIn(['En evaluación', 'En diseño', 'En construcción', 'Ventas finalizadas', 'Cancelado', 'Pausado'])
  nuevo_estado: string;
}
