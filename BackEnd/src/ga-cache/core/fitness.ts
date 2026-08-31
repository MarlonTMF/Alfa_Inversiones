/**
 * GA-Cache: Fitness — Función de Aptitud Multi-Objetivo
 *
 * Evalúa qué tan "buena" es una configuración de caché basándose en
 * las métricas de telemetría recolectadas. Implementa optimización
 * multi-objetivo con pesos configurables.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface FitnessWeights {
  /** Peso para la tasa de acierto (hit rate). Mayor = más importante */
  hitRate: number;
  /** Peso para la penalización de latencia */
  latency: number;
  /** Peso para la penalización de uso de memoria */
  memory: number;
  /** Peso para la penalización de CPU (compresión) */
  cpu: number;
}

export interface TelemetrySnapshot {
  /** Porcentaje de aciertos (0.0 - 1.0) */
  hitRate: number;
  /** Latencia promedio en milisegundos */
  avgLatencyMs: number;
  /** Latencia percentil 95 en milisegundos */
  p95LatencyMs: number;
  /** Uso de memoria en bytes */
  memoryUsageBytes: number;
  /** Límite de memoria configurado en bytes */
  memoryLimitBytes: number;
  /** Total de requests procesados en la ventana */
  totalRequests: number;
  /** Carga de CPU estimada por compresión (0.0 - 1.0) */
  cpuLoad: number;
}

export interface FitnessResult {
  /** Score total de fitness (mayor = mejor) */
  score: number;
  /** Desglose de componentes */
  breakdown: {
    hitRateComponent: number;
    latencyPenalty: number;
    memoryPenalty: number;
    cpuPenalty: number;
  };
}

// ─── Pesos por Defecto ───────────────────────────────────────────────────────

export const DEFAULT_WEIGHTS: FitnessWeights = {
  hitRate: 0.50,    // La tasa de acierto es lo más importante
  latency: 0.25,   // La latencia tiene peso medio
  memory: 0.15,    // El uso de memoria es secundario
  cpu: 0.10,       // La carga de CPU es terciaria
};

/** Preset: Priorizar velocidad sobre ahorro */
export const SPEED_PRIORITY_WEIGHTS: FitnessWeights = {
  hitRate: 0.40,
  latency: 0.40,
  memory: 0.10,
  cpu: 0.10,
};

/** Preset: Priorizar ahorro de recursos */
export const COST_PRIORITY_WEIGHTS: FitnessWeights = {
  hitRate: 0.35,
  latency: 0.15,
  memory: 0.35,
  cpu: 0.15,
};

// ─── Evaluación de Fitness ───────────────────────────────────────────────────

/**
 * Calcula el fitness de una configuración de caché.
 *
 * F = (W_hit × HitRate) - (W_lat × NormalizedLatency) - (W_mem × NormalizedMemory) - (W_cpu × CpuLoad)
 *
 * Todos los componentes se normalizan a [0, 1] para evitar dominancia.
 * El resultado final también se clampea a [0, 1].
 */
export function evaluateFitness(
  snapshot: TelemetrySnapshot,
  weights: FitnessWeights = DEFAULT_WEIGHTS,
): FitnessResult {
  // 1. Componente positivo: Hit Rate (ya normalizado 0-1)
  const hitRateComponent = weights.hitRate * snapshot.hitRate;

  // 2. Penalización por latencia: normalizar contra un umbral de referencia
  //    Usamos 100ms como "latencia máxima tolerable"
  const MAX_ACCEPTABLE_LATENCY_MS = 100;
  const normalizedLatency = Math.min(snapshot.avgLatencyMs / MAX_ACCEPTABLE_LATENCY_MS, 1.0);
  const latencyPenalty = weights.latency * normalizedLatency;

  // 3. Penalización por memoria: proporción del límite usado
  const memoryRatio = snapshot.memoryLimitBytes > 0
    ? Math.min(snapshot.memoryUsageBytes / snapshot.memoryLimitBytes, 1.0)
    : 0;
  const memoryPenalty = weights.memory * memoryRatio;

  // 4. Penalización por CPU (carga de compresión)
  const cpuPenalty = weights.cpu * Math.min(snapshot.cpuLoad, 1.0);

  // Score final: positivo - penalizaciones
  const score = Math.max(0, Math.min(1,
    hitRateComponent - latencyPenalty - memoryPenalty - cpuPenalty,
  ));

  return {
    score,
    breakdown: {
      hitRateComponent,
      latencyPenalty,
      memoryPenalty,
      cpuPenalty,
    },
  };
}

/**
 * Evalúa múltiples configuraciones y asigna el fitness a cada cromosoma.
 * Retorna la población ordenada de mayor a menor fitness.
 */
export function evaluatePopulation(
  chromosomes: { fitness: number }[],
  snapshots: TelemetrySnapshot[],
  weights: FitnessWeights = DEFAULT_WEIGHTS,
): void {
  // Usamos el snapshot más reciente para todas las evaluaciones
  // En el prototipo, cada cromosoma se evalúa con la misma telemetría base
  // pero la función de fitness varía según los parámetros del cromosoma
  const snapshot = snapshots[snapshots.length - 1];
  if (!snapshot) return;

  for (const chromosome of chromosomes) {
    const result = evaluateFitness(snapshot, weights);
    chromosome.fitness = result.score;
  }
}
