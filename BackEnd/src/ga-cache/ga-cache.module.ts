/**
 * GA-Cache: Module — Módulo Global de NestJS
 *
 * Encapsula toda la lógica de GA-Cache como un módulo NestJS autocontenido.
 * Se importa en AppModule con GaCacheModule.forRoot().
 */

import { Module, Global, DynamicModule, OnModuleInit, Logger } from '@nestjs/common';
import { GAEngine, GAEngineConfig, DEFAULT_GA_CONFIG } from './core/ga-engine';
import { L1Cache } from './cache/l1-cache';
import { L2Cache } from './cache/l2-cache';
import { AdaptiveStore } from './cache/adaptive-store';
import { TelemetryService } from './telemetry/telemetry.service';
import { GaCacheInterceptor } from './ga-cache.interceptor';
import { GaCacheGateway } from './ga-cache.gateway';
import { BenchmarkService } from './benchmark/benchmark.service';
import { StressTestController } from './benchmark/stress-test.controller';
import { DashboardController } from './dashboard.controller';

// ─── Configuración del Módulo ────────────────────────────────────────────────

export interface GaCacheModuleOptions {
  /** Configuración del motor GA */
  ga?: Partial<GAEngineConfig>;
  /** Si debe auto-iniciar la evolución al arrancar */
  autoStart?: boolean;
  /** Intervalo de emisión de métricas al dashboard (ms) */
  metricsIntervalMs?: number;
}

// ─── Módulo ──────────────────────────────────────────────────────────────────

@Global()
@Module({})
export class GaCacheModule implements OnModuleInit {
  private readonly logger = new Logger(GaCacheModule.name);
  private metricsTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly gaEngine: GAEngine,
    private readonly store: AdaptiveStore,
    private readonly telemetry: TelemetryService,
    private readonly gateway: GaCacheGateway,
  ) {}

  /**
   * Configuración estática del módulo.
   */
  static forRoot(options: GaCacheModuleOptions = {}): DynamicModule {
    const gaConfig = { ...DEFAULT_GA_CONFIG, ...options.ga };

    return {
      module: GaCacheModule,
      controllers: [StressTestController, DashboardController],
      providers: [
        // Core
        {
          provide: GAEngine,
          useFactory: () => {
            const engine = new GAEngine();
            engine.configure(gaConfig);
            return engine;
          },
        },
        // Cache
        L1Cache,
        L2Cache,
        AdaptiveStore,
        // Telemetry
        TelemetryService,
        // Integration
        GaCacheInterceptor,
        GaCacheGateway,
        // Benchmark
        BenchmarkService,
        // Options
        {
          provide: 'GA_CACHE_OPTIONS',
          useValue: options,
        },
      ],
      exports: [
        GAEngine,
        L1Cache,
        L2Cache,
        AdaptiveStore,
        TelemetryService,
        GaCacheInterceptor,
        GaCacheGateway,
        BenchmarkService,
      ],
    };
  }

  async onModuleInit() {
    this.logger.log('╔══════════════════════════════════════════╗');
    this.logger.log('║    🧬 GA-Cache Module Initialized       ║');
    this.logger.log('║    Evolutionary Cache Optimization       ║');
    this.logger.log('╚══════════════════════════════════════════╝');

    // Conectar el GA Engine con la telemetría
    this.gaEngine.getTelemetrySnapshot = () => {
      const memBytes =
        this.store.getStats().l1.currentMemoryBytes +
        this.store.getStats().l2.currentMemoryBytes;
      return this.telemetry.computeSnapshot(memBytes);
    };

    // Conectar el GA Engine con el gateway para emitir eventos
    this.gaEngine.onGeneration = (event) => {
      this.gateway.emitGeneration(event);

      // Aplicar el mejor genoma al store
      if (event.bestChromosome) {
        this.store.applyGenome(event.bestChromosome);
      }
    };

    // Emitir métricas periódicamente al dashboard
    this.metricsTimer = setInterval(() => {
      const stats = this.store.getStats();
      this.gateway.emitMetrics({
        ...stats,
        timestamp: Date.now(),
        generation: this.gaEngine.getGeneration(),
        bestFitness: this.gaEngine.getBestChromosome()?.fitness ?? 0,
      });
    }, 2000);

    this.logger.log('📊 Dashboard disponible en: /api/v1/ga-cache/dashboard');
    this.logger.log('🔗 API disponible en: /api/v1/ga-cache/status');
  }
}
