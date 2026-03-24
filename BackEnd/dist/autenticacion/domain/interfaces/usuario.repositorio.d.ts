import { UsuarioFuenteDatos } from '../../data/fuentes-datos/usuario.fuente-datos.js';
export interface UsuarioRepositorio {
    buscarPorEmail(email: string): Promise<UsuarioFuenteDatos | null>;
    crear(usuario: Partial<UsuarioFuenteDatos>): Promise<UsuarioFuenteDatos>;
}
export declare const USUARIO_REPOSITORIO: unique symbol;
