/**
 * GA-Cache: Adaptive Store — Orquestador de Caché Multi-Nivel
 *
 * Decide si una petición debe ser servida desde L1 (RAM), L2 (Redis simulado),
 * o la DB. Aplica la configuración del genoma activo del GA.
 */

import { Injectable, Logger } from '@nestjs/common';
import { L1Cache } from './l1-cache';
import { L2Cache } from './l2-cache';
import { Chromosome, EvictionPolicy } from '../core/chromosome';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface StoreResult<T = any> {
  value: T;
  source: 'L1' | 'L2' | 'ORIGIN';
  latencyMs: number;
}

export interface StoreStats {
  l1: ReturnType<L1Cache['getStats']>;
  l2: ReturnType<L2Cache['getStats']>;
  totalRequests: number;
  totalHits: number;
  originCalls: number;
  avgLatencyMs: number;
  combinedHitRate: number;
  estimatedSavingsPercent: number;
}

// ─── Implementación ──────────────────────────────────────────────────────────

@Injectable()
export class AdaptiveStore {
  private readonly logger = new Logger(AdaptiveStore.name);

  private totalRequests = 0;
  private totalHits = 0;
  private originCalls = 0;
  private totalLatencyMs = 0;

  /** Genoma activo que configura el comportamiento */
  private activeGenome: Chromosome | null = null;

  constructor(
    private readonly l1: L1Cache,
    private readonly l2: L2Cache,
  ) {}

  // ─── API Pública ─────────────────────────────────────────────────────────

  /**
   * Obtener un valor del caché multi-nivel.
   * Flujo: L1 → L2 → originFn (DB)
   *
   * @param key - Llave única del recurso
   * @param namespace - Namespace para agrupar (ej. 'properties', 'users')
   * @param originFn - Función que obtiene el dato de la fuente original (DB)
   */
  async get<T = any>(
    key: string,
    namespace: string,
    originFn: () => Promise<T>,
  ): Promise<StoreResult<T>> {
    const fullKey = `${namespace}:${key}`;
    const startTime = Date.now();
    this.totalRequests++;

    // 1. Intentar L1 (RAM local — más rápido)
    const l1Value = this.l1.get<T>(fullKey);
    if (l1Value !== null) {
      const latencyMs = Date.now() - startTime;
      this.totalHits++;
      this.totalLatencyMs += latencyMs;

      // Prefetch probabilístico
      this.maybePrefetch(fullKey, namespace, originFn);

      return { value: l1Value, source: 'L1', latencyMs };
    }

    // 2. Intentar L2 (Redis simulado — segundo más rápido)
    const l2Value = await this.l2.get<T>(fullKey);
    if (l2Value !== null) {
      const latencyMs = Date.now() - startTime;
      this.totalHits++;
      this.totalLatencyMs += latencyMs;

      // Promover a L1 para futuros accesos rápidos
      const ttlL1 = this.activeGenome?.ttlL1
        ? this.activeGenome.ttlL1 * 1000
        : 60_000;
      this.l1.set(fullKey, l2Value, ttlL1);

      return { value: l2Value, source: 'L2', latencyMs };
    }

    // 3. Fallback: obtener de la fuente original (DB)
    this.originCalls++;
    const value = await originFn();
    const latencyMs = Date.now() - startTime;
    this.totalLatencyMs += latencyMs;

    // Almacenar en ambos niveles
    const ttlL1 = this.activeGenome?.ttlL1
      ? this.activeGenome.ttlL1 * 1000
      : 60_000;
    const ttlL2 = this.activeGenome?.ttlL2
      ? this.activeGenome.ttlL2 * 1000
      : 300_000;

    this.l1.set(fullKey, value, ttlL1);
    await this.l2.set(fullKey, value, ttlL2);

    return { value, source: 'ORIGIN', latencyMs };
  }

  /** Invalidar una llave en todos los niveles */
  async invalidate(key: string, namespace: string): Promise<void> {
    const fullKey = `${namespace}:${key}`;
    this.l1.delete(fullKey);
    await this.l2.delete(fullKey);
  }

  /** Limpiar todos los niveles */
  async clearAll(): Promise<void> {
    this.l1.clear();
    await this.l2.clear();
    this.resetStats();
  }

  // ─── Configuración del Genoma ────────────────────────────────────────────

  /**
   * Aplica un nuevo genoma (configuración evolucionada por el GA).
   * Cambia TTLs, política de evicción, etc. en caliente.
   */
  applyGenome(genome: Chromosome): void {
    this.activeGenome = { ...genome };

    // Aplicar configuración a L1
    this.l1.setDefaultTtl(genome.ttlL1 * 1000); // Convertir segundos a ms
    this.l1.setEvictionPolicy(genome.evictionPolicy);

    // Aplicar configuración a L2
    this.l2.setDefaultTtl(genome.ttlL2 * 1000);

    this.logger.verbose(
      `🧬 Genoma aplicado: TTL_L1=${genome.ttlL1}s, TTL_L2=${genome.ttlL2}s, ` +
      `Eviction=${genome.evictionPolicy}, Prefetch=${genome.prefetchProb.toFixed(2)}`
    );
  }

  getActiveGenome(): Chromosome | null {
    return this.activeGenome ? { ...this.activeGenome } : null;
  }

  // ─── Métricas ────────────────────────────────────────────────────────────

  getStats(): StoreStats {
    const l1Stats = this.l1.getStats();
    const l2Stats = this.l2.getStats();
    const combinedHitRate = this.totalRequests > 0
      ? this.totalHits / this.totalRequests
      : 0;

    return {
      l1: l1Stats,
      l2: l2Stats,
      totalRequests: this.totalRequests,
      totalHits: this.totalHits,
      originCalls: this.originCalls,
      avgLatencyMs: this.totalRequests > 0
        ? this.totalLatencyMs / this.totalRequests
        : 0,
      combinedHitRate,
      estimatedSavingsPercent: combinedHitRate * 100,
    };
  }

  resetStats(): void {
    this.totalRequests = 0;
    this.totalHits = 0;
    this.originCalls = 0;
    this.totalLatencyMs = 0;
    this.l1.resetStats();
    this.l2.resetStats();
  }

  // ─── Prefetch Probabilístico ─────────────────────────────────────────────

  /**
   * Si el genoma indica alta probabilidad de prefetch,
   * refresca el dato en segundo plano antes de que expire.
   */
  private maybePrefetch<T>(
    fullKey: string,
    namespace: string,
    originFn: () => Promise<T>,
  ): void {
    if (!this.activeGenome) return;

    if (Math.random() < this.activeGenome.prefetchProb * 0.1) {
      // Ejecutar en background sin esperar (fire-and-forget)
      originFn().then(value => {
        const ttlL1 = this.activeGenome!.ttlL1 * 1000;
        const ttlL2 = this.activeGenome!.ttlL2 * 1000;
        this.l1.set(fullKey, value, ttlL1);
        this.l2.set(fullKey, value, ttlL2).catch(() => {});
      }).catch(() => {
        // Ignorar errores de prefetch silenciosamente
      });
    }
  }
}
