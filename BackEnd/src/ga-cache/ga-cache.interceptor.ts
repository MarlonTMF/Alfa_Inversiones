/**
 * GA-Cache: Interceptor — Middleware de Caché Transparente
 *
 * NestJS Interceptor que envuelve los handlers decorados con @EvolutionaryCache.
 * Intercepta la petición, consulta el AdaptiveStore, y registra telemetría.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { AdaptiveStore } from './cache/adaptive-store';
import { TelemetryService } from './telemetry/telemetry.service';
import { GA_CACHE_METADATA_KEY, EvolutionaryCacheOptions } from './evolutionary-cache.decorator';

@Injectable()
export class GaCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GaCacheInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly store: AdaptiveStore,
    private readonly telemetry: TelemetryService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Leer metadata del decorador @EvolutionaryCache
    const cacheOptions = this.reflector.get<EvolutionaryCacheOptions>(
      GA_CACHE_METADATA_KEY,
      context.getHandler(),
    );

    // Si no tiene el decorador, pasar de largo
    if (!cacheOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const method = request?.method ?? 'GET';

    // Solo cachear métodos GET
    if (method !== 'GET') {
      // En mutaciones (POST/PUT/DELETE), invalidar el namespace
      if (cacheOptions.invalidateOnMutation && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        return next.handle().pipe(
          tap(() => {
            this.store.invalidate('*', cacheOptions.namespace).catch(() => {});
            this.logger.verbose(`🗑️ Caché invalidado: ${cacheOptions.namespace}`);
          }),
        );
      }
      return next.handle();
    }

    // Construir llave única basada en URL + query params
    const url = request?.url ?? context.getHandler().name;
    const queryString = request?.query
      ? JSON.stringify(request.query)
      : '';
    const cacheKey = `${url}:${queryString}`;

    const startTime = Date.now();

    // Usar el AdaptiveStore para buscar en L1 → L2 → ejecutar handler
    return from(
      this.store.get(
        cacheKey,
        cacheOptions.namespace,
        () => {
          // Esta es la función "origin" — ejecuta el handler real
          return new Promise<any>((resolve, reject) => {
            next.handle().subscribe({
              next: (data) => resolve(data),
              error: (err) => reject(err),
            });
          });
        },
      ),
    ).pipe(
      tap((result) => {
        const latencyMs = Date.now() - startTime;

        // Registrar telemetría
        if (result.source === 'ORIGIN') {
          this.telemetry.recordMiss(cacheKey, latencyMs);
        } else {
          this.telemetry.recordHit(cacheKey, result.source, latencyMs);
        }
      }),
      // Extraer solo el valor para el consumidor
      switchMap((result) => of(result.value)),
    );
  }
}
