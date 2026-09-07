import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegistrarUsuarioCasoUso } from './registrar-usuario.caso-uso.js';
import type { UsuarioRepositorio } from '../interfaces/usuario.repositorio.js';
import { UsuarioFuenteDatos } from '../../data/fuentes-datos/usuario.fuente-datos.js';
import { RegistroUsuarioDto } from '../../presentation/dto/registro-usuario.dto.js';

describe('RegistrarUsuarioCasoUso', () => {
  let casoUso: RegistrarUsuarioCasoUso;
  let usuarioRepositorio: jest.Mocked<UsuarioRepositorio>;

  const dto: RegistroUsuarioDto = {
    nombre: 'Ana Torrez',
    rol: 'inversionista',
    email: 'ana@correo.com',
    password: 'clave123',
  };

  beforeEach(() => {
    usuarioRepositorio = {
      buscarPorEmail: jest.fn(),
      crear: jest.fn(),
    };
    casoUso = new RegistrarUsuarioCasoUso(usuarioRepositorio);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('lanza ConflictException si el email ya esta registrado, sin crear un usuario nuevo', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue({
      id: 'existente',
    } as UsuarioFuenteDatos);

    await expect(casoUso.ejecutar(dto)).rejects.toThrow(ConflictException);
    expect(usuarioRepositorio.crear).not.toHaveBeenCalled();
  });

  it('guarda el usuario con la contrasena hasheada, nunca en texto plano', async () => {
    usuarioRepositorio.buscarPorEmail.mockResolvedValue(null);
    usuarioRepositorio.crear.mockResolvedValue({} as UsuarioFuenteDatos);

    const resultado = await casoUso.ejecutar(dto);

    expect(usuarioRepositorio.crear).toHaveBeenCalledTimes(1);
    const usuarioCreado = usuarioRepositorio.crear.mock.calls[0][0];

    expect(usuarioCreado.password).not.toBe(dto.password);
    expect(usuarioCreado.password).toBeDefined();
    await expect(
      bcrypt.compare(dto.password, usuarioCreado.password as string),
    ).resolves.toBe(true);

    expect(usuarioCreado).toMatchObject({
      nombre: dto.nombre,
      rol: dto.rol,
      email: dto.email,
    });
    expect(resultado).toEqual({ mensaje: 'Usuario registrado exitosamente' });
  });
});
