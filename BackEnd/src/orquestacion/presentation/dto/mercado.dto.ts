import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ActualizarMercadoDto {
  @IsString()
  zone: string;

  @IsString()
  city: string;

  @IsNumber()
  avg_price_per_m2: number;

  @IsOptional()
  @IsNumber()
  annual_appreciation?: number;
}
