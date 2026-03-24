import { JwtService } from '@nestjs/jwt';
import type { UsuarioRepositorio } from '../interfaces/usuario.repositorio.js';
import { InicioSesionDto } from '../../presentation/dto/inicio-sesion.dto.js';
import { RespuestaLoginDto } from '../../presentation/dto/respuesta-login.dto.js';
export declare class IniciarSesionCasoUso {
    private readonly usuarioRepositorio;
    private readonly jwtService;
    constructor(usuarioRepositorio: UsuarioRepositorio, jwtService: JwtService);
    ejecutar(dto: InicioSesionDto): Promise<RespuestaLoginDto>;
}
