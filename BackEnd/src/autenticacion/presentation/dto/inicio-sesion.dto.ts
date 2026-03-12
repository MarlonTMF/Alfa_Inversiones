import { IsEmail, IsString } from 'class-validator';

export class InicioSesionDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
