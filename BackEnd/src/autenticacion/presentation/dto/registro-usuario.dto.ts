import { IsString, IsEmail, MinLength, IsIn } from 'class-validator';

export class RegistroUsuarioDto {
  @IsString()
  nombre: string;

  @IsIn(['inversionista', 'constructor', 'propietario'])
  rol: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
