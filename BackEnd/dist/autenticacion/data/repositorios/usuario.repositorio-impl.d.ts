import { Repository } from 'typeorm';
import { UsuarioRepositorio } from '../../domain/interfaces/usuario.repositorio.js';
import { UsuarioFuenteDatos } from '../fuentes-datos/usuario.fuente-datos.js';
export declare class UsuarioRepositorioImpl implements UsuarioRepositorio {
    private readonly usuarioRepo;
    constructor(usuarioRepo: Repository<UsuarioFuenteDatos>);
    buscarPorEmail(email: string): Promise<UsuarioFuenteDatos | null>;
    crear(usuario: Partial<UsuarioFuenteDatos>): Promise<UsuarioFuenteDatos>;
}
