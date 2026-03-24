import type { UsuarioRepositorio } from '../interfaces/usuario.repositorio.js';
import { RegistroUsuarioDto } from '../../presentation/dto/registro-usuario.dto.js';
export declare class RegistrarUsuarioCasoUso {
    private readonly usuarioRepositorio;
    constructor(usuarioRepositorio: UsuarioRepositorio);
    ejecutar(dto: RegistroUsuarioDto): Promise<{
        mensaje: string;
    }>;
}
