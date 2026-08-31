/**
 * GA-Cache: GA Engine — Motor del Algoritmo Genético
 *
 * Implementa el ciclo evolutivo completo:
 * Inicialización → Evaluación → Selección → Cruce → Mutación → Elitismo
 *
 * Se ejecuta de forma asíncrona para no bloquear el Event Loop.
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  Chromosome,
  createPopulation,
  crossover,
  mutate,
  DEFAULT_GENE_RANGES,
  GeneRanges,
} from './chromosome';
import {
  evaluateFitness,
  FitnessWeights,
  DEFAULT_WEIGHTS,
  TelemetrySnapshot,
  FitnessResult,
} from './fitness';

// ─── Configuración del Motor ─────────────────────────────────────────────────

export interface GAEngineConfig {
  /** Tamaño de la población */
  populationSize: number;
  /** Tasa de mutación (0.0 - 1.0) */
  mutationRate: number;
  /** Número de élites que pasan directamente a la siguiente generación */
  eliteCount: number;
  /** Tamaño del torneo para selección */
  tournamentSize: number;
  /** Intervalo entre generaciones en milisegundos */
  evolutionIntervalMs: number;
  /** Rangos válidos para los genes */
  geneRanges: GeneRanges;
  /** Pesos de la función de fitness */
  fitnessWeights: FitnessWeights;
}

export const DEFAULT_GA_CONFIG: GAEngineConfig = {
  populationSize: 30,
  mutationRate: 0.15,
  eliteCount: 2,
  tournamentSize: 5,
  evolutionIntervalMs: 3000, // Evolucionar cada 3 segundos
  geneRanges: DEFAULT_GENE_RANGES,
  fitnessWeights: DEFAULT_WEIGHTS,
};

// ─── Evento de Generación ────────────────────────────────────────────────────

export interface GenerationEvent {
  generation: number;
  bestFitness: number;
  avgFitness: number;
  worstFitness: number;
  bestChromosome: Chromosome;
  populationDiversity: number;
  timestamp: number;
}

// ─── Motor Evolutivo ─────────────────────────────────────────────────────────

@Injectable()
export class GAEngine implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GAEngine.name);

  private population: Chromosome[] = [];
  private config: GAEngineConfig;
  private generation = 0;
  private bestEver: Chromosome | null = null;
  private evolutionTimer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  /** Callback que se invoca cuando se completa una generación */
  public onGeneration: ((event: GenerationEvent) => void) | null = null;

  /** Callback para obtener telemetría actual */
  public getTelemetrySnapshot: (() => TelemetrySnapshot) | null = null;

  /** Historial de las mejores fitness por generación (para gráficos) */
  private fitnessHistory: { generation: number; best: number; avg: number }[] = [];

  constructor() {
    this.config = { ...DEFAULT_GA_CONFIG };
  }

  onModuleInit() {
    this.logger.log('🧬 GA Engine inicializado');
    this.initialize();
  }

  onModuleDestroy() {
    this.stop();
  }

  // ─── API Pública ─────────────────────────────────────────────────────────

  /** Configura el motor con parámetros personalizados */
  configure(config: Partial<GAEngineConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.log(`⚙️ Configuración actualizada: pop=${this.config.populationSize}, mut=${this.config.mutationRate}`);
  }

  /** Inicializa la población */
  initialize(): void {
    this.population = createPopulation(this.config.populationSize, this.config.geneRanges);
    this.generation = 0;
    this.bestEver = null;
    this.fitnessHistory = [];
    this.logger.log(`🌱 Población inicial creada: ${this.population.length} cromosomas`);
  }

  /** Inicia la evolución periódica */
  start(): void {
    if (this.running) return;
    this.running = true;

    this.evolutionTimer = setInterval(() => {
      this.evolveGeneration();
    }, this.config.evolutionIntervalMs);

    this.logger.log(`▶️ Evolución iniciada (intervalo: ${this.config.evolutionIntervalMs}ms)`);
  }

  /** Detiene la evolución */
  stop(): void {
    if (this.evolutionTimer) {
      clearInterval(this.evolutionTimer);
      this.evolutionTimer = null;
    }
    this.running = false;
    this.logger.log('⏹️ Evolución detenida');
  }

  /** Ejecuta una sola generación manualmente (útil para benchmarks) */
  evolveOneGeneration(snapshot: TelemetrySnapshot): GenerationEvent {
    return this.evolveWithSnapshot(snapshot);
  }

  /** Retorna el mejor cromosoma encontrado hasta ahora */
  getBestChromosome(): Chromosome | null {
    return this.bestEver ? { ...this.bestEver } : null;
  }

  /** Retorna la generación actual */
  getGeneration(): number {
    return this.generation;
  }

  /** Retorna si está corriendo */
  isRunning(): boolean {
    return this.running;
  }

  /** Retorna historial de fitness para gráficos */
  getFitnessHistory(): { generation: number; best: number; avg: number }[] {
    return [...this.fitnessHistory];
  }

  /** Retorna la población actual */
  getPopulation(): Chromosome[] {
    return this.population.map(c => ({ ...c }));
  }

  /** Retorna el estado completo del motor para el dashboard */
  getStatus() {
    return {
      running: this.running,
      generation: this.generation,
      populationSize: this.population.length,
      bestChromosome: this.bestEver,
      fitnessHistory: this.fitnessHistory.slice(-100), // Últimas 100 generaciones
      config: this.config,
    };
  }

  // ─── Lógica Evolutiva ────────────────────────────────────────────────────

  private evolveGeneration(): void {
    if (!this.getTelemetrySnapshot) return;

    const snapshot = this.getTelemetrySnapshot();
    if (snapshot.totalRequests === 0) return; // No hay datos suficientes

    this.evolveWithSnapshot(snapshot);
  }

  private evolveWithSnapshot(snapshot: TelemetrySnapshot): GenerationEvent {
    this.generation++;

    // 1. Evaluar fitness de toda la población
    this.evaluateAll(snapshot);

    // 2. Ordenar por fitness (descendente)
    this.population.sort((a, b) => b.fitness - a.fitness);

    // 3. Actualizar mejor global
    const currentBest = this.population[0];
    if (!this.bestEver || currentBest.fitness > this.bestEver.fitness) {
      this.bestEver = { ...currentBest };
      this.logger.verbose(`🏆 Nuevo mejor genoma [Gen ${this.generation}]: fitness=${currentBest.fitness.toFixed(4)}`);
    }

    // 4. Calcular estadísticas
    const avgFitness = this.population.reduce((s, c) => s + c.fitness, 0) / this.population.length;
    const worstFitness = this.population[this.population.length - 1].fitness;
    const diversity = this.calculateDiversity();

    // 5. Registrar historial
    this.fitnessHistory.push({
      generation: this.generation,
      best: currentBest.fitness,
      avg: avgFitness,
    });

    // 6. Crear nueva generación
    const newPopulation: Chromosome[] = [];

    // 6a. Elitismo: copiar los mejores directamente
    for (let i = 0; i < this.config.eliteCount && i < this.population.length; i++) {
      newPopulation.push({ ...this.population[i] });
    }

    // 6b. Llenar el resto con selección + cruce + mutación
    while (newPopulation.length < this.config.populationSize) {
      const parent1 = this.tournamentSelect();
      const parent2 = this.tournamentSelect();

      let [child1, child2] = crossover(parent1, parent2);
      child1 = mutate(child1, this.config.mutationRate, this.config.geneRanges);
      child2 = mutate(child2, this.config.mutationRate, this.config.geneRanges);

      newPopulation.push(child1);
      if (newPopulation.length < this.config.populationSize) {
        newPopulation.push(child2);
      }
    }

    this.population = newPopulation;

    // 7. Emitir evento
    const event: GenerationEvent = {
      generation: this.generation,
      bestFitness: currentBest.fitness,
      avgFitness,
      worstFitness,
      bestChromosome: { ...currentBest },
      populationDiversity: diversity,
      timestamp: Date.now(),
    };

    if (this.onGeneration) {
      this.onGeneration(event);
    }

    return event;
  }

  /**
   * Evalúa el fitness de cada cromosoma.
   * La clave: cada cromosoma genera una TelemetrySnapshot SIMULADA
   * basándose en cómo sus parámetros habrían afectado al sistema.
   */
  private evaluateAll(realSnapshot: TelemetrySnapshot): void {
    for (const chromosome of this.population) {
      const simulatedSnapshot = this.simulateChromosomeEffect(chromosome, realSnapshot);
      const result = evaluateFitness(simulatedSnapshot, this.config.fitnessWeights);
      chromosome.fitness = result.score;
    }
  }

  /**
   * Simula cómo un cromosoma habría afectado las métricas.
   * Esta es la función más crítica: mapea genes → impacto en métricas.
   */
  private simulateChromosomeEffect(
    chromosome: Chromosome,
    baseline: TelemetrySnapshot,
  ): TelemetrySnapshot {
    // TTL más alto → más hit rate (datos permanecen más tiempo)
    // Pero TTL demasiado alto → penalización por memoria
    const ttlFactor = (chromosome.ttlL1 + chromosome.ttlL2) / (600 + 7200); // Normalizado
    const hitRateBoost = ttlFactor * 0.3; // Hasta 30% mejora

    // Prefetch mejora hit rate en tráfico predecible
    const prefetchBoost = chromosome.prefetchProb * 0.15;

    // Eviction policy afecta hit rate según patrón de tráfico
    const evictionBonus = chromosome.evictionPolicy === 'ARC' ? 0.05
      : chromosome.evictionPolicy === 'LFU' ? 0.03
      : 0.0; // LRU es la baseline

    // Hit rate simulado
    const simulatedHitRate = Math.min(1.0,
      baseline.hitRate + hitRateBoost + prefetchBoost + evictionBonus
      + (Math.random() - 0.5) * 0.05, // Ruido estocástico
    );

    // Latencia: mejor hit rate → menor latencia
    const latencyReduction = simulatedHitRate * 0.6;
    const compressionPenalty = chromosome.compressionLevel * 0.5; // ms por nivel
    const simulatedLatency = Math.max(1,
      baseline.avgLatencyMs * (1 - latencyReduction) + compressionPenalty,
    );

    // Memoria: TTL alto + prefetch = más memoria
    const memoryMultiplier = 1 + ttlFactor * 0.5 + chromosome.prefetchProb * 0.2;
    const compressionSavings = 1 - (chromosome.compressionLevel * 0.05);
    const simulatedMemory = baseline.memoryUsageBytes * memoryMultiplier * compressionSavings;

    // CPU: compresión consume CPU
    const simulatedCpu = Math.min(1.0, baseline.cpuLoad + chromosome.compressionLevel * 0.05);

    return {
      hitRate: simulatedHitRate,
      avgLatencyMs: simulatedLatency,
      p95LatencyMs: simulatedLatency * 1.5,
      memoryUsageBytes: simulatedMemory,
      memoryLimitBytes: baseline.memoryLimitBytes,
      totalRequests: baseline.totalRequests,
      cpuLoad: simulatedCpu,
    };
  }

  /** Selección por torneo: elige T individuos al azar y retorna el mejor */
  private tournamentSelect(): Chromosome {
    let best: Chromosome | null = null;

    for (let i = 0; i < this.config.tournamentSize; i++) {
      const idx = Math.floor(Math.random() * this.population.length);
      const candidate = this.population[idx];
      if (!best || candidate.fitness > best.fitness) {
        best = candidate;
      }
    }

    return best!;
  }

  /** Calcula diversidad genética como la desviación estándar del fitness */
  private calculateDiversity(): number {
    if (this.population.length === 0) return 0;
    const avg = this.population.reduce((s, c) => s + c.fitness, 0) / this.population.length;
    const variance = this.population.reduce((s, c) => s + Math.pow(c.fitness - avg, 2), 0) / this.population.length;
    return Math.sqrt(variance);
  }
}
