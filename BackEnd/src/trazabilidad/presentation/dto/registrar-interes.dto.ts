import { IsOptional, IsUUID } from 'class-validator';

export class RegistrarInteresDto {
  @IsUUID()
  usuario_id: string;

  @IsOptional()
  @IsUUID()
  terreno_id?: string;

  @IsOptional()
  @IsUUID()
  property_id?: string;
}
