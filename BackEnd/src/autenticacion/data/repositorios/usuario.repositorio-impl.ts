import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRepositorio } from '../../domain/interfaces/usuario.repositorio.js';
import { UsuarioFuenteDatos } from '../fuentes-datos/usuario.fuente-datos.js';

@Injectable()
export class UsuarioRepositorioImpl implements UsuarioRepositorio {
  constructor(
    @InjectRepository(UsuarioFuenteDatos)
    private readonly usuarioRepo: Repository<UsuarioFuenteDatos>,
  ) {}

  async buscarPorEmail(email: string): Promise<UsuarioFuenteDatos | null> {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  async crear(
    usuario: Partial<UsuarioFuenteDatos>,
  ): Promise<UsuarioFuenteDatos> {
    const nuevo = this.usuarioRepo.create(usuario);
    return this.usuarioRepo.save(nuevo);
  }
}
