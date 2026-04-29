import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para la creación de una nueva propiedad.
 * Define la estructura de datos que se espera del cliente para el registro.
 */
export class CreatePropertyDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  status?: string;

  // UBICACIÓN
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  uv?: string;

  @IsString()
  @IsOptional()
  zoneBarrio?: string;

  @IsString()
  @IsOptional()
  exactAddress?: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;

  // DIMENSIONES
  @IsNumber()
  @IsOptional()
  totalArea?: number;

  @IsNumber()
  @IsOptional()
  frontM?: number;

  @IsNumber()
  @IsOptional()
  backM?: number;

  // VALORACIÓN
  @IsNumber()
  @IsOptional()
  pricePerM2?: number;

  @IsNumber()
  @IsOptional()
  basePriceNegotiation?: number;

  // EDIFICABILIDAD Y RETORNO
  @IsNumber()
  @IsOptional()
  allowedFloors?: number;

  @IsNumber()
  @IsOptional()
  buildabilityIndex?: number;

  @IsNumber()
  @IsOptional()
  projectedRoi?: number;

  @IsNumber()
  @IsOptional()
  landIncidence?: number;

  // DETALLES ADICIONALES
  @IsNumber()
  @IsOptional()
  constructionCostSqm?: number;

  @IsNumber()
  @IsOptional()
  salesCycleMonths?: number;

  @IsBoolean()
  @IsOptional()
  maxHeightVerified?: boolean;

  @IsString()
  @IsOptional()
  developmentType?: string;

  @IsString()
  @IsOptional()
  finishQuality?: string;

  @IsString()
  @IsOptional()
  advisorVision?: string;

  /**
   * Polígono de la propiedad (Arreglo de coordenadas [[lat, lng], ...])
   * Se usará para representar la forma exacta en el mapa.
   */
  @IsArray()
  @IsOptional()
  polygon?: number[][];

  @IsString()
  @IsOptional()
  landUse?: string;

  @IsString()
  @IsOptional()
  department?: string;
}
