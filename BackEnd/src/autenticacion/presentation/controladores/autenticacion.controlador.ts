import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrarUsuarioCasoUso } from '../../domain/casos-uso/registrar-usuario.caso-uso.js';
import { IniciarSesionCasoUso } from '../../domain/casos-uso/iniciar-sesion.caso-uso.js';
import { RegistroUsuarioDto } from '../dto/registro-usuario.dto.js';
import { InicioSesionDto } from '../dto/inicio-sesion.dto.js';
import { RespuestaLoginDto } from '../dto/respuesta-login.dto.js';

@Controller('auth')
export class AutenticacionControlador {
  constructor(
    private readonly registrarUsuario: RegistrarUsuarioCasoUso,
    private readonly iniciarSesion: IniciarSesionCasoUso,
  ) {}

  @Post('register')
  async registro(
    @Body() dto: RegistroUsuarioDto,
  ): Promise<{ mensaje: string }> {
    return this.registrarUsuario.ejecutar(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: InicioSesionDto): Promise<RespuestaLoginDto> {
    return this.iniciarSesion.ejecutar(dto);
  }
}
