import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { UsuarioRepositorio } from '../interfaces/usuario.repositorio.js';
import { USUARIO_REPOSITORIO } from '../interfaces/usuario.repositorio.js';
import { InicioSesionDto } from '../../presentation/dto/inicio-sesion.dto.js';
import { RespuestaLoginDto } from '../../presentation/dto/respuesta-login.dto.js';

@Injectable()
export class IniciarSesionCasoUso {
  constructor(
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly jwtService: JwtService,
  ) {}

  async ejecutar(dto: InicioSesionDto): Promise<RespuestaLoginDto> {
    const usuario = await this.usuarioRepositorio.buscarPorEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    const token = this.jwtService.sign(payload);

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        email: usuario.email,
      },
    };
  }
}
