import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { UsuarioRepositorio } from '../interfaces/usuario.repositorio.js';
import { USUARIO_REPOSITORIO } from '../interfaces/usuario.repositorio.js';
import { RegistroUsuarioDto } from '../../presentation/dto/registro-usuario.dto.js';

@Injectable()
export class RegistrarUsuarioCasoUso {
  constructor(
    @Inject(USUARIO_REPOSITORIO)
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  async ejecutar(dto: RegistroUsuarioDto): Promise<{ mensaje: string }> {
    const existente = await this.usuarioRepositorio.buscarPorEmail(dto.email);
    if (existente) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.usuarioRepositorio.crear({
      nombre: dto.nombre,
      rol: dto.rol,
      email: dto.email,
      password: passwordHash,
    });

    return { mensaje: 'Usuario registrado exitosamente' };
  }
}
