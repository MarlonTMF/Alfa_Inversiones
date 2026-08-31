/**
 * GA-Cache: Telemetry Service — Servicio de Recolección de Métricas
 *
 * Centraliza la recolección de métricas de cada petición y las expone
 * como snapshots agregados para alimentar la función de fitness del GA.
 */

import { Injectable, Logger } from '@nestjs/common';
import { RingBuffer, TelemetryEntry } from './ring-buffer';
import { TelemetrySnapshot } from '../core/fitness';

// ─── Implementación ──────────────────────────────────────────────────────────

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  private readonly ringBuffer: RingBuffer;

  /** Métricas agregadas actuales */
  private currentSnapshot: TelemetrySnapshot = this.emptySnapshot();

  /** Historial de snapshots (para el dashboard) */
  private snapshotHistory: (TelemetrySnapshot & { timestamp: number })[] = [];
  private maxHistorySize = 500;

  /** Límite de memoria configurado (para cálculos de fitness) */
  private memoryLimitBytes = 250 * 1024 * 1024; // 250 MB

  constructor() {
    this.ringBuffer = new RingBuffer(8192);
  }

  // ─── Registro de Eventos ─────────────────────────────────────────────────

  /**
   * Registra un evento de acceso al caché.
   * Llamado por el interceptor en cada petición. Ultra-rápido (O(1)).
   */
  record(entry: Omit<TelemetryEntry, 'timestamp'>): void {
    this.ringBuffer.write({
      ...entry,
      timestamp: Date.now(),
    });
  }

  /**
   * Registra un hit con datos mínimos (shorthand).
   */
  recordHit(key: string, source: 'L1' | 'L2', latencyMs: number, dataSizeBytes: number = 0): void {
    this.record({
      key,
      isHit: true,
      source,
      latencyMs,
      dataSizeBytes,
    });
  }

  /**
   * Registra un miss (ida a la DB).
   */
  recordMiss(key: string, latencyMs: number, dataSizeBytes: number = 0): void {
    this.record({
      key,
      isHit: false,
      source: 'ORIGIN',
      latencyMs,
      dataSizeBytes,
    });
  }

  // ─── Snapshots Agregados ─────────────────────────────────────────────────

  /**
   * Procesa los datos pendientes del ring buffer y genera un snapshot actualizado.
   * Llamado periódicamente por el GA Engine.
   */
  computeSnapshot(currentMemoryBytes: number): TelemetrySnapshot {
    const entries = this.ringBuffer.drain();

    if (entries.length === 0) {
      return this.currentSnapshot;
    }

    // Calcular métricas agregadas
    const totalHits = entries.filter(e => e.isHit).length;
    const hitRate = entries.length > 0 ? totalHits / entries.length : 0;

    const latencies = entries.map(e => e.latencyMs);
    const avgLatencyMs = latencies.reduce((a, b) => a + b, 0) / latencies.length;

    // Percentil 95
    const sortedLatencies = [...latencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedLatencies.length * 0.95);
    const p95LatencyMs = sortedLatencies[p95Index] || avgLatencyMs;

    // Estimar carga de CPU (simulado basado en volumen de requests)
    const cpuLoad = Math.min(1.0, entries.length / 1000);

    this.currentSnapshot = {
      hitRate,
      avgLatencyMs,
      p95LatencyMs,
      memoryUsageBytes: currentMemoryBytes,
      memoryLimitBytes: this.memoryLimitBytes,
      totalRequests: entries.length,
      cpuLoad,
    };

    // Guardar en historial
    this.snapshotHistory.push({
      ...this.currentSnapshot,
      timestamp: Date.now(),
    });

    // Limitar historial
    if (this.snapshotHistory.length > this.maxHistorySize) {
      this.snapshotHistory = this.snapshotHistory.slice(-this.maxHistorySize);
    }

    return this.currentSnapshot;
  }

  /**
   * Retorna el snapshot actual sin recomputar.
   */
  getCurrentSnapshot(): TelemetrySnapshot {
    return { ...this.currentSnapshot };
  }

  /**
   * Retorna el historial de snapshots para gráficos del dashboard.
   */
  getSnapshotHistory(): (TelemetrySnapshot & { timestamp: number })[] {
    return [...this.snapshotHistory];
  }

  /**
   * Retorna información del ring buffer.
   */
  getBufferStats() {
    return {
      bufferSize: this.ringBuffer.size(),
      bufferCapacity: this.ringBuffer.getCapacity(),
      totalWritten: this.ringBuffer.getTotalWritten(),
      isFull: this.ringBuffer.isFull(),
    };
  }

  // ─── Configuración ──────────────────────────────────────────────────────

  setMemoryLimit(bytes: number): void {
    this.memoryLimitBytes = bytes;
  }

  // ─── Reset ──────────────────────────────────────────────────────────────

  reset(): void {
    this.ringBuffer.reset();
    this.currentSnapshot = this.emptySnapshot();
    this.snapshotHistory = [];
  }

  // ─── Utilidades ─────────────────────────────────────────────────────────

  private emptySnapshot(): TelemetrySnapshot {
    return {
      hitRate: 0,
      avgLatencyMs: 0,
      p95LatencyMs: 0,
      memoryUsageBytes: 0,
      memoryLimitBytes: this.memoryLimitBytes,
      totalRequests: 0,
      cpuLoad: 0,
    };
  }
}
