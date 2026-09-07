import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { IniciarSesionCasoUso } from './iniciar-sesion.caso-uso.js';
import type { UsuarioRepositorio } from '../interfaces/usuario.repositorio.js';
import { UsuarioFuenteDatos } from '../../data/fuentes-datos/usuario.fuente-datos.js';

// bcryptjs, importado con `import * as bcrypt`, expone un namespace cuyas
// propiedades no son redefinibles con jest.spyOn (TypeError: Cannot
// redefine property). Se mockea el modulo completo en su lugar.
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('IniciarSesionCasoUso', () => {
  let casoUso: IniciarSesionCasoUso;
  let usuarioRepositorio: jest.Mocked<UsuarioRepositorio>;
  let jwtService: jest.Mocked<JwtService>;

  const usuarioMock: UsuarioFuenteDatos = {
    id: 'user-1',
    nombre: 'Ana Torrez',
    rol: 'inversionista',
    email: 'ana@correo.com',
    password: 'hash-en-bd',
    fecha_creacion: new Date(),
  };

  beforeEach(() => {
    usuarioRepositorio = {
      buscarPorEmail: jest.fn(),
      crear: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token-firmado'),
    } as unknown as jest.Mocked<JwtService>;

    casoUso = new IniciarSesionCasoUso(usuarioRepositorio, jwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lanza UnauthorizedException si el email no existe (sin filtrar si el email existe o no)', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue(null);

    await expect(
      casoUso.ejecutar({ email: 'nadie@correo.com', password: 'cualquiera' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('lanza UnauthorizedException si la contraseña no coincide con el hash guardado', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue(usuarioMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      casoUso.ejecutar({ email: usuarioMock.email, password: 'incorrecta' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('devuelve token y datos del usuario (sin el hash de password) con credenciales validas', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue(usuarioMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const resultado = await casoUso.ejecutar({
      email: usuarioMock.email,
      password: 'correcta',
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: usuarioMock.id,
      email: usuarioMock.email,
      rol: usuarioMock.rol,
    });
    expect(resultado).toEqual({
      token: 'token-firmado',
      usuario: {
        id: usuarioMock.id,
        nombre: usuarioMock.nombre,
        rol: usuarioMock.rol,
        email: usuarioMock.email,
      },
    });
    // La respuesta nunca debe filtrar el hash de la contraseña.
    expect(resultado.usuario).not.toHaveProperty('password');
  });
});
