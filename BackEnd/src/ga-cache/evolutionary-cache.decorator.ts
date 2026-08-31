/**
 * GA-Cache: Evolutionary Cache Decorator
 *
 * Decorador de método que marca endpoints/servicios para ser
 * gestionados por el motor evolutivo de GA-Cache.
 *
 * Uso:
 *   @EvolutionaryCache({ namespace: 'properties', priority: 'HIGH' })
 *   async getProperties() { ... }
 */

import { SetMetadata } from '@nestjs/common';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type CachePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EvolutionaryCacheOptions {
  /** Namespace para agrupar llaves de caché (ej. 'properties', 'users') */
  namespace: string;
  /** Prioridad del recurso — afecta la agresividad de cacheo */
  priority?: CachePriority;
  /** TTL mínimo permitido en segundos (el GA no bajará de esto) */
  minTtl?: number;
  /** TTL máximo permitido en segundos (el GA no subirá de esto) */
  maxTtl?: number;
  /** Si debe invalidar el caché cuando se detecta una mutación (POST/PUT/DELETE) */
  invalidateOnMutation?: boolean;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

export const GA_CACHE_METADATA_KEY = 'ga-cache:options';

// ─── Decorador ───────────────────────────────────────────────────────────────

/**
 * Decorador que marca un método de servicio/controlador para optimización evolutiva.
 *
 * El interceptor de GA-Cache leerá esta metadata para decidir:
 * - Qué namespace usar como llave de caché
 * - Qué prioridad asignar al recurso
 * - Qué restricciones de TTL respetar
 *
 * @example
 * ```typescript
 * @EvolutionaryCache({ namespace: 'inventory', priority: 'HIGH' })
 * async getProperties() {
 *   return this.db.query('SELECT * FROM properties');
 * }
 * ```
 */
export const EvolutionaryCache = (options: EvolutionaryCacheOptions) =>
  SetMetadata(GA_CACHE_METADATA_KEY, {
    namespace: options.namespace,
    priority: options.priority ?? 'MEDIUM',
    minTtl: options.minTtl ?? 5,
    maxTtl: options.maxTtl ?? 7200,
    invalidateOnMutation: options.invalidateOnMutation ?? true,
  });
