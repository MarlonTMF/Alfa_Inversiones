import { IsNumber, Min, Max } from 'class-validator';

export class BoundingBoxDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  minLat: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  maxLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  minLng: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  maxLng: number;
}
