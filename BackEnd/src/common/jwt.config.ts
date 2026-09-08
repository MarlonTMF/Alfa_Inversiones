import type { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Opciones compartidas de JwtModule. Antes cada modulo que necesitaba
 * JwtService (autenticacion, y ahora orquestacion/proyectos para verificar
 * el token en AdminGuard) definia su propio JwtModule.register({...}) por
 * separado: un secreto o expiracion distintos entre ellos habria roto la
 * verificacion de tokens firmados en otro modulo, en silencio.
 */
export const JWT_MODULE_OPTIONS: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'clave-secreta-desarrollo-365',
  signOptions: { expiresIn: '24h' },
};
