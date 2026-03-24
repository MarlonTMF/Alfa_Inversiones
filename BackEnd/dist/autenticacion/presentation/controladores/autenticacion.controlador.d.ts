import { RegistrarUsuarioCasoUso } from '../../domain/casos-uso/registrar-usuario.caso-uso.js';
import { IniciarSesionCasoUso } from '../../domain/casos-uso/iniciar-sesion.caso-uso.js';
import { RegistroUsuarioDto } from '../dto/registro-usuario.dto.js';
import { InicioSesionDto } from '../dto/inicio-sesion.dto.js';
import { RespuestaLoginDto } from '../dto/respuesta-login.dto.js';
export declare class AutenticacionControlador {
    private readonly registrarUsuario;
    private readonly iniciarSesion;
    constructor(registrarUsuario: RegistrarUsuarioCasoUso, iniciarSesion: IniciarSesionCasoUso);
    registro(dto: RegistroUsuarioDto): Promise<{
        mensaje: string;
    }>;
    login(dto: InicioSesionDto): Promise<RespuestaLoginDto>;
}
