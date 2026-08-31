/**
 * GA-Cache: L1 Cache — Caché en Memoria RAM
 *
 * Implementa caché en memoria local (process RAM) con soporte para
 * múltiples políticas de evicción (LRU, LFU, ARC) y TTL dinámico.
 */

import { Injectable, Logger } from '@nestjs/common';
import { EvictionPolicy } from '../core/chromosome';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface CacheEntry<T = any> {
  key: string;
  value: T;
  sizeBytes: number;
  createdAt: number;
  lastAccessedAt: number;
  accessCount: number;
  ttlMs: number;
}

export interface L1Stats {
  hits: number;
  misses: number;
  evictions: number;
  currentSize: number;
  currentMemoryBytes: number;
  hitRate: number;
}

// ─── Implementación ──────────────────────────────────────────────────────────

@Injectable()
export class L1Cache {
  private readonly logger = new Logger(L1Cache.name);

  private store = new Map<string, CacheEntry>();
  private maxSize = 1000;           // Max entradas
  private maxMemoryBytes = 50 * 1024 * 1024; // 50 MB
  private currentMemoryBytes = 0;
  private evictionPolicy: EvictionPolicy = 'LRU';
  private defaultTtlMs = 60_000;    // 60 segundos

  // Métricas
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  // ─── API Pública ─────────────────────────────────────────────────────────

  /** Obtener un valor del caché */
  get<T = any>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Verificar expiración
    if (Date.now() - entry.createdAt > entry.ttlMs) {
      this.store.delete(key);
      this.currentMemoryBytes -= entry.sizeBytes;
      this.misses++;
      return null;
    }

    // Actualizar metadata de acceso
    entry.lastAccessedAt = Date.now();
    entry.accessCount++;
    this.hits++;

    return entry.value as T;
  }

  /** Almacenar un valor en el caché */
  set<T = any>(key: string, value: T, ttlMs?: number): void {
    const serialized = JSON.stringify(value);
    const sizeBytes = Buffer.byteLength(serialized, 'utf-8');

    // Si ya existe, actualizar
    if (this.store.has(key)) {
      const existing = this.store.get(key)!;
      this.currentMemoryBytes -= existing.sizeBytes;
    }

    // Evictar si es necesario
    while (
      (this.store.size >= this.maxSize || this.currentMemoryBytes + sizeBytes > this.maxMemoryBytes) &&
      this.store.size > 0
    ) {
      this.evict();
    }

    const entry: CacheEntry = {
      key,
      value,
      sizeBytes,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
      accessCount: 1,
      ttlMs: ttlMs ?? this.defaultTtlMs,
    };

    this.store.set(key, entry);
    this.currentMemoryBytes += sizeBytes;
  }

  /** Invalidar una llave */
  delete(key: string): boolean {
    const entry = this.store.get(key);
    if (entry) {
      this.currentMemoryBytes -= entry.sizeBytes;
      this.store.delete(key);
      return true;
    }
    return false;
  }

  /** Limpiar todo el caché */
  clear(): void {
    this.store.clear();
    this.currentMemoryBytes = 0;
  }

  /** Verificar si una llave existe y no ha expirado */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() - entry.createdAt > entry.ttlMs) {
      this.store.delete(key);
      this.currentMemoryBytes -= entry.sizeBytes;
      return false;
    }
    return true;
  }

  // ─── Configuración Dinámica (controlada por el GA) ───────────────────────

  /** Actualizar TTL default (llamado por el GA cuando muta) */
  setDefaultTtl(ttlMs: number): void {
    this.defaultTtlMs = ttlMs;
  }

  /** Cambiar política de evicción en caliente */
  setEvictionPolicy(policy: EvictionPolicy): void {
    this.evictionPolicy = policy;
  }

  /** Ajustar límite de memoria */
  setMaxMemory(bytes: number): void {
    this.maxMemoryBytes = bytes;
  }

  /** Ajustar límite de entradas */
  setMaxSize(size: number): void {
    this.maxSize = size;
  }

  // ─── Métricas ────────────────────────────────────────────────────────────

  getStats(): L1Stats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      currentSize: this.store.size,
      currentMemoryBytes: this.currentMemoryBytes,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  getCurrentMemoryBytes(): number {
    return this.currentMemoryBytes;
  }

  getMaxMemoryBytes(): number {
    return this.maxMemoryBytes;
  }

  // ─── Evicción ────────────────────────────────────────────────────────────

  private evict(): void {
    let victim: string | null = null;

    switch (this.evictionPolicy) {
      case 'LRU':
        victim = this.findLRUVictim();
        break;
      case 'LFU':
        victim = this.findLFUVictim();
        break;
      case 'ARC':
        // ARC simplificado: combina LRU y LFU
        victim = Math.random() < 0.5 ? this.findLRUVictim() : this.findLFUVictim();
        break;
    }

    if (victim) {
      const entry = this.store.get(victim)!;
      this.currentMemoryBytes -= entry.sizeBytes;
      this.store.delete(victim);
      this.evictions++;
    }
  }

  /** Encuentra la entrada menos recientemente usada */
  private findLRUVictim(): string | null {
    let oldest: CacheEntry | null = null;

    for (const entry of this.store.values()) {
      if (!oldest || entry.lastAccessedAt < oldest.lastAccessedAt) {
        oldest = entry;
      }
    }

    return oldest?.key ?? null;
  }

  /** Encuentra la entrada menos frecuentemente usada */
  private findLFUVictim(): string | null {
    let leastUsed: CacheEntry | null = null;

    for (const entry of this.store.values()) {
      if (!leastUsed || entry.accessCount < leastUsed.accessCount) {
        leastUsed = entry;
      }
    }

    return leastUsed?.key ?? null;
  }
}
