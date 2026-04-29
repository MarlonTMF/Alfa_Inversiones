import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const adminId = request.headers['x-admin-id'];

    if (!adminId) {
      throw new UnauthorizedException(
        'Falta encabezado de autorización de administrador (x-admin-id)',
      );
    }

    try {
      const result = await this.dataSource.query(
        'SELECT rol FROM usuarios WHERE id = $1',
        [adminId],
      );

      if (result.length === 0) {
        throw new UnauthorizedException(
          'Usuario no encontrado en base de datos PostgreSQL',
        );
      }

      const rol = String(result[0].rol || '').toLowerCase();
      const rolesPermitidos = new Set(['admin', 'superadmin', 'super-admin']);

      if (!rolesPermitidos.has(rol)) {
        throw new ForbiddenException(
          `Rol '${rol}' insuficiente. Se requieren privilegios de Administrador.`,
        );
      }

      request.user = { id: adminId, rol };
      return true;
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new UnauthorizedException(
        'Error al validar permisos de administrador',
      );
    }
  }
}
