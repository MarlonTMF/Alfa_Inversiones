/**
 * GA-Cache: Stress Test Controller — Endpoints de Pruebas de Carga
 *
 * Expone endpoints REST para disparar benchmarks, consultar resultados
 * y ver el estado del motor GA.
 */

import { Controller, Post, Get, Body, Query, Logger } from '@nestjs/common';
import { BenchmarkService, BenchmarkResult } from './benchmark.service';
import { GAEngine } from '../core/ga-engine';
import { AdaptiveStore } from '../cache/adaptive-store';
import { TelemetryService } from '../telemetry/telemetry.service';
import { TrafficPattern } from './traffic-simulator';

// ─── DTOs ────────────────────────────────────────────────────────────────────

class RunBenchmarkDto {
  pattern?: TrafficPattern;
  totalRequests?: number;
  uniqueKeys?: number;
  rps?: number;
}

// ─── Controller ──────────────────────────────────────────────────────────────

@Controller('ga-cache')
export class StressTestController {
  private readonly logger = new Logger(StressTestController.name);

  constructor(
    private readonly benchmark: BenchmarkService,
    private readonly gaEngine: GAEngine,
    private readonly store: AdaptiveStore,
    private readonly telemetry: TelemetryService,
  ) {}

  /**
   * POST /api/v1/ga-cache/benchmark/run
   * Ejecuta un benchmark completo
   */
  @Post('benchmark/run')
  async runBenchmark(@Body() body: RunBenchmarkDto): Promise<BenchmarkResult> {
    this.logger.log(`🚀 Benchmark solicitado: ${JSON.stringify(body)}`);

    return this.benchmark.runBenchmark(
      body.pattern ?? 'composite',
      body.totalRequests ?? 8000,
      body.uniqueKeys ?? 500,
      body.rps ?? 500,
    );
  }

  /**
   * GET /api/v1/ga-cache/benchmark/results
   * Obtiene el último resultado de benchmark
   */
  @Get('benchmark/results')
  getLastResults(): BenchmarkResult | { message: string } {
    const result = this.benchmark.getLastResult();
    if (!result) {
      return { message: 'No hay resultados de benchmark. Ejecute POST /benchmark/run primero.' };
    }
    return result;
  }

  /**
   * GET /api/v1/ga-cache/status
   * Estado actual del motor GA y caché
   */
  @Get('status')
  getStatus() {
    return {
      gaEngine: this.gaEngine.getStatus(),
      store: this.store.getStats(),
      telemetry: {
        current: this.telemetry.getCurrentSnapshot(),
        buffer: this.telemetry.getBufferStats(),
      },
      activeGenome: this.store.getActiveGenome(),
      benchmarkRunning: this.benchmark.getIsRunning(),
    };
  }

  /**
   * POST /api/v1/ga-cache/engine/start
   * Inicia la evolución del GA
   */
  @Post('engine/start')
  startEngine() {
    this.gaEngine.start();
    return { message: 'Motor GA iniciado', running: true };
  }

  /**
   * POST /api/v1/ga-cache/engine/stop
   * Detiene la evolución del GA
   */
  @Post('engine/stop')
  stopEngine() {
    this.gaEngine.stop();
    return { message: 'Motor GA detenido', running: false };
  }

  /**
   * POST /api/v1/ga-cache/cache/clear
   * Limpia todo el caché
   */
  @Post('cache/clear')
  async clearCache() {
    await this.store.clearAll();
    this.telemetry.reset();
    return { message: 'Caché y telemetría limpiados' };
  }

  /**
   * GET /api/v1/ga-cache/fitness-history
   * Historial de fitness para gráficos
   */
  @Get('fitness-history')
  getFitnessHistory() {
    return this.gaEngine.getFitnessHistory();
  }

  /**
   * GET /api/v1/ga-cache/telemetry-history
   * Historial de snapshots de telemetría
   */
  @Get('telemetry-history')
  getTelemetryHistory() {
    return this.telemetry.getSnapshotHistory();
  }
}
