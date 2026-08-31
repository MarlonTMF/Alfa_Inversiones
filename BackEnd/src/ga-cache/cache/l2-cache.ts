/**
 * GA-Cache: L2 Cache — Caché Distribuido Simulado (Redis-like)
 *
 * Simula un caché distribuido (como Redis/Valkey) en memoria local.
 * Incluye latencia artificial para simular el network overhead real.
 * En producción se sustituiría por un cliente ioredis/redis real.
 */

import { Injectable, Logger } from '@nestjs/common';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface L2Entry {
  key: string;
  value: Buffer;         // Almacenamos como Buffer para simular binary storage
  originalSizeBytes: number;
  compressedSizeBytes: number;
  createdAt: number;
  ttlMs: number;
  accessCount: number;
}

export interface L2Stats {
  hits: number;
  misses: number;
  currentSize: number;
  currentMemoryBytes: number;
  avgNetworkLatencyMs: number;
  hitRate: number;
}

// ─── Implementación ──────────────────────────────────────────────────────────

@Injectable()
export class L2Cache {
  private readonly logger = new Logger(L2Cache.name);

  private store = new Map<string, L2Entry>();
  private maxMemoryBytes = 200 * 1024 * 1024; // 200 MB
  private currentMemoryBytes = 0;
  private defaultTtlMs = 300_000;   // 5 minutos

  /** Latencia de red simulada (ms) para simular round-trip a Redis */
  private networkLatencyMs = 2;

  // Métricas
  private hits = 0;
  private misses = 0;
  private totalLatencyMs = 0;
  private totalOps = 0;

  // ─── API Pública ─────────────────────────────────────────────────────────

  /** Obtener un valor del caché L2 (con latencia simulada) */
  async get<T = any>(key: string): Promise<T | null> {
    await this.simulateNetworkLatency();

    const entry = this.store.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Verificar expiración
    if (Date.now() - entry.createdAt > entry.ttlMs) {
      this.currentMemoryBytes -= entry.compressedSizeBytes;
      this.store.delete(key);
      this.misses++;
      return null;
    }

    entry.accessCount++;
    this.hits++;

    // Deserializar el Buffer de vuelta a JSON
    const json = entry.value.toString('utf-8');
    return JSON.parse(json) as T;
  }

  /** Almacenar un valor en el caché L2 (con latencia simulada) */
  async set<T = any>(key: string, value: T, ttlMs?: number): Promise<void> {
    await this.simulateNetworkLatency();

    const json = JSON.stringify(value);
    const originalSize = Buffer.byteLength(json, 'utf-8');
    const buffer = Buffer.from(json, 'utf-8');

    // Simular compresión simple (en producción sería Zstd)
    const compressedSize = buffer.length;

    // Si ya existe, liberar memoria
    if (this.store.has(key)) {
      const existing = this.store.get(key)!;
      this.currentMemoryBytes -= existing.compressedSizeBytes;
    }

    // Evictar si necesario (LRU simple para L2)
    while (this.currentMemoryBytes + compressedSize > this.maxMemoryBytes && this.store.size > 0) {
      this.evictOldest();
    }

    this.store.set(key, {
      key,
      value: buffer,
      originalSizeBytes: originalSize,
      compressedSizeBytes: compressedSize,
      createdAt: Date.now(),
      ttlMs: ttlMs ?? this.defaultTtlMs,
      accessCount: 0,
    });

    this.currentMemoryBytes += compressedSize;
  }

  /** Eliminar una llave */
  async delete(key: string): Promise<boolean> {
    await this.simulateNetworkLatency();

    const entry = this.store.get(key);
    if (entry) {
      this.currentMemoryBytes -= entry.compressedSizeBytes;
      this.store.delete(key);
      return true;
    }
    return false;
  }

  /** Limpiar todo */
  async clear(): Promise<void> {
    this.store.clear();
    this.currentMemoryBytes = 0;
  }

  /** Verificar existencia */
  async has(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() - entry.createdAt > entry.ttlMs) {
      this.currentMemoryBytes -= entry.compressedSizeBytes;
      this.store.delete(key);
      return false;
    }
    return true;
  }

  // ─── Configuración Dinámica ──────────────────────────────────────────────

  setDefaultTtl(ttlMs: number): void {
    this.defaultTtlMs = ttlMs;
  }

  setNetworkLatency(ms: number): void {
    this.networkLatencyMs = ms;
  }

  setMaxMemory(bytes: number): void {
    this.maxMemoryBytes = bytes;
  }

  // ─── Métricas ────────────────────────────────────────────────────────────

  getStats(): L2Stats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      currentSize: this.store.size,
      currentMemoryBytes: this.currentMemoryBytes,
      avgNetworkLatencyMs: this.totalOps > 0 ? this.totalLatencyMs / this.totalOps : 0,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalLatencyMs = 0;
    this.totalOps = 0;
  }

  getCurrentMemoryBytes(): number {
    return this.currentMemoryBytes;
  }

  // ─── Internos ────────────────────────────────────────────────────────────

  /** Simula la latencia de red de un round-trip a Redis */
  private async simulateNetworkLatency(): Promise<void> {
    const jitter = this.networkLatencyMs * (0.5 + Math.random());
    this.totalLatencyMs += jitter;
    this.totalOps++;
    await new Promise(resolve => setTimeout(resolve, jitter));
  }

  /** Evicta la entrada más antigua (TTL-based) */
  private evictOldest(): void {
    let oldest: L2Entry | null = null;

    for (const entry of this.store.values()) {
      if (!oldest || entry.createdAt < oldest.createdAt) {
        oldest = entry;
      }
    }

    if (oldest) {
      this.currentMemoryBytes -= oldest.compressedSizeBytes;
      this.store.delete(oldest.key);
    }
  }
}
