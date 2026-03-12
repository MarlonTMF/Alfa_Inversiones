import { IsNumber, Min, Max, IsIn } from 'class-validator';

export class ConsultaAmenidadesDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsNumber()
  @Min(0)
  radio: number;

  @IsIn(['mercado', 'transporte', 'colegio', 'hospital'])
  tipo: string;
}
