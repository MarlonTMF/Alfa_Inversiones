import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

/** Payload que firma IniciarSesionCasoUso al hacer login. */
interface PayloadJwt {
  sub: string;
  email: string;
  rol: string;
}

const ROLES_PERMITIDOS = new Set(['admin', 'superadmin', 'super-admin']);

/**
 * Antes este guard confiaba ciegamente en una cabecera `x-admin-id`
 * mandada por el propio cliente, sin firma ni verificacion: cualquiera
 * podia mandar el id de un administrador real (obtenible con solo
 * loguearse una vez) y quedar autorizado, sin token, sin login, sin
 * limite de tiempo. El login ya firma un JWT con el rol adentro
 * (ver iniciar-sesion.caso-uso.ts) que hasta ahora nadie verificaba:
 * este guard ahora exige y valida ese token real.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extraerToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'Falta el token de autorización (Authorization: Bearer <token>)',
      );
    }

    let payload: PayloadJwt;
    try {
      payload = await this.jwtService.verifyAsync<PayloadJwt>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const rol = String(payload.rol || '').toLowerCase();
    if (!ROLES_PERMITIDOS.has(rol)) {
      throw new ForbiddenException(
        `Rol '${rol}' insuficiente. Se requieren privilegios de Administrador.`,
      );
    }

    (request as Request & { user: PayloadJwt }).user = payload;
    return true;
  }

  private extraerToken(request: Request): string | undefined {
    const cabecera = request.headers.authorization;
    if (!cabecera?.startsWith('Bearer ')) return undefined;
    return cabecera.slice('Bearer '.length).trim() || undefined;
  }
}
