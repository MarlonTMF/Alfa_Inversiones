import { IsNumber, Min, Max, IsOptional } from 'class-validator';

export class BoundingBoxDto {
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  minLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  maxLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  minLng?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  maxLng?: number;
}
