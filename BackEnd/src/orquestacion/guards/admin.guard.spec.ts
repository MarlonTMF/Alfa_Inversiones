import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from './admin.guard.js';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let jwtService: jest.Mocked<Pick<JwtService, 'verifyAsync'>>;

  function contextoConHeader(authorization?: string): ExecutionContext {
    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: authorization ? { authorization } : {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    guard = new AdminGuard(jwtService as unknown as JwtService);
  });

  it('rechaza la peticion si no hay cabecera Authorization', async () => {
    await expect(guard.canActivate(contextoConHeader())).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rechaza la peticion si la cabecera no usa el esquema Bearer', async () => {
    await expect(
      guard.canActivate(contextoConHeader('Basic algo')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rechaza un token invalido o expirado', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

    await expect(
      guard.canActivate(contextoConHeader('Bearer token-invalido')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rechaza un token valido pero con rol insuficiente', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      email: 'inversor@correo.com',
      rol: 'inversionista',
    });

    await expect(
      guard.canActivate(contextoConHeader('Bearer token-valido')),
    ).rejects.toThrow(ForbiddenException);
  });

  it('permite el acceso con un token valido de rol admin y expone el payload en request.user', async () => {
    const payload = { sub: 'admin-1', email: 'admin@correo.com', rol: 'admin' };
    jwtService.verifyAsync.mockResolvedValue(payload);

    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: { authorization: 'Bearer token-valido' },
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual(payload);
  });

  it('acepta el rol super-admin ademas de admin', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'super-1',
      email: 'super@correo.com',
      rol: 'super-admin',
    });

    await expect(
      guard.canActivate(contextoConHeader('Bearer token-valido')),
    ).resolves.toBe(true);
  });
});
