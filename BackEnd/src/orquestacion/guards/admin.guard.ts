import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AdminGuard implements CanActivate {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const adminId = request.headers['x-admin-id'];

    if (!adminId) {
      throw new UnauthorizedException('Falta encabezado de autorización de administrador (x-admin-id)');
    }

    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT rol FROM usuarios WHERE id = $1', [adminId]);
      
      if (result.rowCount === 0) {
        throw new UnauthorizedException('Usuario no encontrado en base de datos PostgreSQL nativa');
      }

      const rol = result.rows[0].rol;
      if (rol !== 'admin' && rol !== 'superadmin') {
        throw new ForbiddenException(`Rol '${rol}' insuficiente. Se requieren privilegios de Super Admin.`);
      }

      request.user = { id: adminId, rol };
      return true;
    } finally {
      client.release();
    }
  }
}
