import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AutenticacionControlador } from '../src/autenticacion/presentation/controladores/autenticacion.controlador';
import { RegistrarUsuarioCasoUso } from '../src/autenticacion/domain/casos-uso/registrar-usuario.caso-uso';
import { IniciarSesionCasoUso } from '../src/autenticacion/domain/casos-uso/iniciar-sesion.caso-uso';
import { USUARIO_REPOSITORIO } from '../src/autenticacion/domain/interfaces/usuario.repositorio';
import type { UsuarioRepositorio } from '../src/autenticacion/domain/interfaces/usuario.repositorio';
import { UsuarioFuenteDatos } from '../src/autenticacion/data/fuentes-datos/usuario.fuente-datos';
import { RespuestaLoginDto } from '../src/autenticacion/presentation/dto/respuesta-login.dto';

/**
 * E2E de /api/v1/auth: ejercita la pila real (HTTP -> ValidationPipe global
 * -> controlador -> caso de uso), pero con un repositorio de usuarios en
 * memoria en vez de conectar a Postgres real. Sin esto, correr el modulo
 * completo (AppModule) exige credenciales de una base de datos real, lo
 * que no es viable ni deseable en un pipeline de tests.
 */
class UsuarioRepositorioEnMemoria implements UsuarioRepositorio {
  private usuarios: UsuarioFuenteDatos[] = [];

  buscarPorEmail(email: string): Promise<UsuarioFuenteDatos | null> {
    return Promise.resolve(
      this.usuarios.find((u) => u.email === email) ?? null,
    );
  }

  crear(usuario: Partial<UsuarioFuenteDatos>): Promise<UsuarioFuenteDatos> {
    const nuevo = {
      id: String(this.usuarios.length + 1),
      fecha_creacion: new Date(),
      ...usuario,
    } as UsuarioFuenteDatos;
    this.usuarios.push(nuevo);
    return Promise.resolve(nuevo);
  }
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'clave-de-test' })],
      controllers: [AutenticacionControlador],
      providers: [
        RegistrarUsuarioCasoUso,
        IniciarSesionCasoUso,
        {
          provide: USUARIO_REPOSITORIO,
          useClass: UsuarioRepositorioEnMemoria,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const credenciales = {
    nombre: 'Ana Torrez',
    rol: 'inversionista',
    email: 'ana@correo.com',
    password: 'clave123',
  };

  it('POST /api/v1/auth/register rechaza un payload invalido (email mal formado)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ ...credenciales, email: 'no-es-un-email' })
      .expect(400);
  });

  it('POST /api/v1/auth/register crea un usuario nuevo', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(credenciales)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          mensaje: 'Usuario registrado exitosamente',
        });
      });
  });

  it('POST /api/v1/auth/register rechaza un email ya registrado', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(credenciales)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(credenciales)
      .expect(409);
  });

  it('POST /api/v1/auth/login rechaza credenciales inexistentes', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'nadie@correo.com', password: 'lo-que-sea' })
      .expect(401);
  });

  it('flujo completo: registra un usuario y luego hace login con sus credenciales', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(credenciales)
      .expect(201);

    const respuestaLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: credenciales.email, password: credenciales.password })
      .expect(200);

    const cuerpo = respuestaLogin.body as RespuestaLoginDto;
    expect(cuerpo.token).toBeDefined();
    expect(cuerpo.usuario).toMatchObject({
      email: credenciales.email,
      nombre: credenciales.nombre,
      rol: credenciales.rol,
    });
    expect(cuerpo.usuario).not.toHaveProperty('password');
  });

  it('POST /api/v1/auth/login rechaza una contrasena incorrecta para un usuario existente', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(credenciales)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: credenciales.email, password: 'contrasena-incorrecta' })
      .expect(401);
  });
});
