import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWT_MODULE_OPTIONS } from '../common/jwt.config.js';

// Data
import { UsuarioFuenteDatos } from './data/fuentes-datos/usuario.fuente-datos.js';
import { UsuarioRepositorioImpl } from './data/repositorios/usuario.repositorio-impl.js';

// Domain
import { USUARIO_REPOSITORIO } from './domain/interfaces/usuario.repositorio.js';
import { RegistrarUsuarioCasoUso } from './domain/casos-uso/registrar-usuario.caso-uso.js';
import { IniciarSesionCasoUso } from './domain/casos-uso/iniciar-sesion.caso-uso.js';

// Presentation
import { AutenticacionControlador } from './presentation/controladores/autenticacion.controlador.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioFuenteDatos]),
    JwtModule.register(JWT_MODULE_OPTIONS),
  ],
  controllers: [AutenticacionControlador],
  providers: [
    {
      provide: USUARIO_REPOSITORIO,
      useClass: UsuarioRepositorioImpl,
    },
    RegistrarUsuarioCasoUso,
    IniciarSesionCasoUso,
  ],
  // JwtModule se re-exporta para que AdminGuard (orquestacion, proyectos)
  // pueda verificar el token sin duplicar el registro de JwtModule.
  exports: [USUARIO_REPOSITORIO, JwtModule],
})
export class AutenticacionModule {}
