/**
 * GA-Cache: Chromosome — Estructura del Genoma
 *
 * Cada cromosoma codifica una configuración candidata del sistema de caché.
 * El Algoritmo Genético evoluciona poblaciones de estos cromosomas para
 * encontrar la configuración óptima según las condiciones de tráfico actuales.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type EvictionPolicy = 'LRU' | 'LFU' | 'ARC';

export interface Chromosome {
  /** Tiempo de vida en caché L1 (RAM local), en segundos */
  ttlL1: number;
  /** Tiempo de vida en caché L2 (distribuido/Redis), en segundos */
  ttlL2: number;
  /** Política de evicción activa */
  evictionPolicy: EvictionPolicy;
  /** Probabilidad de prefetch (0.0 - 1.0) — refresca antes de expirar si tráfico alto */
  prefetchProb: number;
  /** Nivel de compresión simulado (0=ninguno, 1-9 progresivo) */
  compressionLevel: number;
  /** Fitness score asignado por la función de evaluación */
  fitness: number;
}

// ─── Rangos Válidos para cada Gen ────────────────────────────────────────────

export interface GeneRanges {
  ttlL1: { min: number; max: number };
  ttlL2: { min: number; max: number };
  prefetchProb: { min: number; max: number };
  compressionLevel: { min: number; max: number };
}

export const DEFAULT_GENE_RANGES: GeneRanges = {
  ttlL1: { min: 5, max: 600 },          // 5s a 10min
  ttlL2: { min: 30, max: 7200 },        // 30s a 2h
  prefetchProb: { min: 0.0, max: 1.0 },
  compressionLevel: { min: 0, max: 9 },
};

const EVICTION_POLICIES: EvictionPolicy[] = ['LRU', 'LFU', 'ARC'];

// ─── Factory ─────────────────────────────────────────────────────────────────

/** Genera un cromosoma aleatorio dentro de los rangos válidos */
export function createRandomChromosome(
  ranges: GeneRanges = DEFAULT_GENE_RANGES,
): Chromosome {
  return {
    ttlL1: randomInt(ranges.ttlL1.min, ranges.ttlL1.max),
    ttlL2: randomInt(ranges.ttlL2.min, ranges.ttlL2.max),
    evictionPolicy: EVICTION_POLICIES[randomInt(0, EVICTION_POLICIES.length - 1)],
    prefetchProb: randomFloat(ranges.prefetchProb.min, ranges.prefetchProb.max),
    compressionLevel: randomInt(ranges.compressionLevel.min, ranges.compressionLevel.max),
    fitness: 0,
  };
}

/** Genera una población inicial de N cromosomas aleatorios */
export function createPopulation(
  size: number,
  ranges: GeneRanges = DEFAULT_GENE_RANGES,
): Chromosome[] {
  return Array.from({ length: size }, () => createRandomChromosome(ranges));
}

// ─── Operadores Genéticos ────────────────────────────────────────────────────

/**
 * Cruce de un solo punto (Single-Point Crossover).
 * Combina genes de dos padres para producir dos hijos.
 */
export function crossover(parent1: Chromosome, parent2: Chromosome): [Chromosome, Chromosome] {
  const genes: (keyof Omit<Chromosome, 'fitness'>)[] = [
    'ttlL1', 'ttlL2', 'evictionPolicy', 'prefetchProb', 'compressionLevel',
  ];
  const crossPoint = randomInt(1, genes.length - 1);

  const child1 = { ...parent1, fitness: 0 };
  const child2 = { ...parent2, fitness: 0 };

  for (let i = crossPoint; i < genes.length; i++) {
    const gene = genes[i];
    (child1 as any)[gene] = (parent2 as any)[gene];
    (child2 as any)[gene] = (parent1 as any)[gene];
  }

  return [child1, child2];
}

/**
 * Mutación gaussiana.
 * Aplica una perturbación aleatoria a cada gen numérico con cierta probabilidad.
 */
export function mutate(
  chromosome: Chromosome,
  mutationRate: number = 0.1,
  ranges: GeneRanges = DEFAULT_GENE_RANGES,
): Chromosome {
  const mutated = { ...chromosome };

  if (Math.random() < mutationRate) {
    mutated.ttlL1 = clamp(
      mutated.ttlL1 + gaussianNoise(0, 30),
      ranges.ttlL1.min,
      ranges.ttlL1.max,
    );
  }

  if (Math.random() < mutationRate) {
    mutated.ttlL2 = clamp(
      mutated.ttlL2 + gaussianNoise(0, 120),
      ranges.ttlL2.min,
      ranges.ttlL2.max,
    );
  }

  if (Math.random() < mutationRate) {
    mutated.evictionPolicy =
      EVICTION_POLICIES[randomInt(0, EVICTION_POLICIES.length - 1)];
  }

  if (Math.random() < mutationRate) {
    mutated.prefetchProb = clamp(
      mutated.prefetchProb + gaussianNoise(0, 0.1),
      ranges.prefetchProb.min,
      ranges.prefetchProb.max,
    );
  }

  if (Math.random() < mutationRate) {
    mutated.compressionLevel = clamp(
      Math.round(mutated.compressionLevel + gaussianNoise(0, 1)),
      ranges.compressionLevel.min,
      ranges.compressionLevel.max,
    );
  }

  return mutated;
}

// ─── Utilidades Internas ─────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value * 100) / 100));
}

/** Box-Muller transform para ruido gaussiano */
function gaussianNoise(mean: number, stddev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stddev + mean;
}
