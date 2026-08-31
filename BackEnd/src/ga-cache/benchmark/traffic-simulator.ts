/**
 * GA-Cache: Traffic Simulator — Simulador de Patrones de Tráfico v2
 *
 * Genera workloads realistas con timestamps virtuales que permiten
 * simular horas de tráfico en segundos de benchmark.
 */

export type TrafficPattern = 'normal' | 'hotspot' | 'burst' | 'drift' | 'composite';

export interface TrafficConfig {
  pattern: TrafficPattern;
  totalRequests: number;
  uniqueKeys: number;
  rps: number;
  burstDurationMs?: number;
  burstMultiplier?: number;
}

export interface TrafficRequest {
  key: string;
  /** Timestamp VIRTUAL en ms — simula tiempo real extendido */
  virtualTimestampMs: number;
  dataSizeBytes: number;
  dbLatencyMs: number;
}

export class TrafficSimulator {
  static generate(config: TrafficConfig): TrafficRequest[] {
    switch (config.pattern) {
      case 'normal':    return this.generateNormal(config);
      case 'hotspot':   return this.generateHotspot(config);
      case 'burst':     return this.generateBurst(config);
      case 'drift':     return this.generateDrift(config);
      case 'composite': return this.generateComposite(config);
      default:          return this.generateNormal(config);
    }
  }

  /**
   * Patrón COMPOSITE: 4 fases que cambian el patrón de acceso.
   * Simula un día real: mañana tranquila → pico de mediodía → viral → cambio de interés.
   * Duración virtual: ~10 minutos (600,000ms) para que los TTLs expiren y la adaptación importa.
   */
  private static generateComposite(config: TrafficConfig): TrafficRequest[] {
    const requests: TrafficRequest[] = [];
    const perPhase = Math.floor(config.totalRequests / 4);
    const virtualDurationMs = 600_000; // 10 min virtuales
    const phaseMs = virtualDurationMs / 4;
    const hotKeys = Math.max(3, Math.floor(config.uniqueKeys * 0.05)); // Top 5% de keys

    // Fase 1: NORMAL — distribución uniforme, tráfico bajo
    for (let i = 0; i < perPhase; i++) {
      const keyIndex = Math.floor(Math.random() * config.uniqueKeys);
      requests.push({
        key: `prop_${keyIndex}`,
        virtualTimestampMs: (i / perPhase) * phaseMs,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 15 + Math.random() * 25,
      });
    }

    // Fase 2: HOTSPOT — pocas propiedades se vuelven trending
    for (let i = 0; i < perPhase; i++) {
      let keyIndex: number;
      if (Math.random() < 0.85) {
        keyIndex = Math.floor(Math.random() * hotKeys); // 85% → top 5%
      } else {
        keyIndex = hotKeys + Math.floor(Math.random() * (config.uniqueKeys - hotKeys));
      }
      requests.push({
        key: `prop_${keyIndex}`,
        virtualTimestampMs: phaseMs + (i / perPhase) * phaseMs,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 15 + Math.random() * 25,
      });
    }

    // Fase 3: BURST — una propiedad se vuelve viral, RPS se multiplica
    const viralKey = Math.floor(Math.random() * hotKeys);
    for (let i = 0; i < perPhase; i++) {
      let keyIndex: number;
      if (Math.random() < 0.6) {
        keyIndex = viralKey;
      } else if (Math.random() < 0.5) {
        keyIndex = Math.floor(Math.random() * hotKeys);
      } else {
        keyIndex = Math.floor(Math.random() * config.uniqueKeys);
      }
      // El intervalo virtual se comprime (más requests/seg)
      const burstCompression = 0.3; // 3x más denso
      requests.push({
        key: `prop_${keyIndex}`,
        virtualTimestampMs: phaseMs * 2 + (i / perPhase) * phaseMs * burstCompression,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 30 + Math.random() * 60, // DB más lenta bajo carga
      });
    }

    // Fase 4: DRIFT — las keys populares cambian completamente
    const newPopularOffset = Math.floor(config.uniqueKeys * 0.6);
    const newHotKeys = Math.max(3, Math.floor(config.uniqueKeys * 0.08));
    for (let i = 0; i < perPhase; i++) {
      let keyIndex: number;
      if (Math.random() < 0.75) {
        keyIndex = newPopularOffset + Math.floor(Math.random() * newHotKeys);
        keyIndex = Math.min(keyIndex, config.uniqueKeys - 1);
      } else {
        keyIndex = Math.floor(Math.random() * config.uniqueKeys);
      }
      requests.push({
        key: `prop_${keyIndex}`,
        virtualTimestampMs: phaseMs * 3 + (i / perPhase) * phaseMs,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 15 + Math.random() * 25,
      });
    }

    return requests;
  }

  private static generateNormal(config: TrafficConfig): TrafficRequest[] {
    const requests: TrafficRequest[] = [];
    const virtualDurationMs = 300_000; // 5 min virtuales
    for (let i = 0; i < config.totalRequests; i++) {
      requests.push({
        key: `prop_${Math.floor(Math.random() * config.uniqueKeys)}`,
        virtualTimestampMs: (i / config.totalRequests) * virtualDurationMs,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 15 + Math.random() * 25,
      });
    }
    return requests;
  }

  private static generateHotspot(config: TrafficConfig): TrafficRequest[] {
    const requests: TrafficRequest[] = [];
    const virtualDurationMs = 300_000;
    const hotKeyCount = Math.max(1, Math.floor(config.uniqueKeys * 0.1));
    for (let i = 0; i < config.totalRequests; i++) {
      const keyIndex = Math.random() < 0.8
        ? Math.floor(Math.random() * hotKeyCount)
        : hotKeyCount + Math.floor(Math.random() * (config.uniqueKeys - hotKeyCount));
      requests.push({
        key: `prop_${keyIndex}`,
        virtualTimestampMs: (i / config.totalRequests) * virtualDurationMs,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 15 + Math.random() * 25,
      });
    }
    return requests;
  }

  private static generateBurst(config: TrafficConfig): TrafficRequest[] {
    const requests: TrafficRequest[] = [];
    const virtualDurationMs = 300_000;
    const viralKey = Math.floor(Math.random() * config.uniqueKeys);
    const burstStart = virtualDurationMs * 0.35;
    const burstEnd = burstStart + virtualDurationMs * 0.2;

    for (let i = 0; i < config.totalRequests; i++) {
      const vt = (i / config.totalRequests) * virtualDurationMs;
      const inBurst = vt >= burstStart && vt <= burstEnd;
      const keyIndex = inBurst && Math.random() < 0.7
        ? viralKey
        : Math.floor(Math.random() * config.uniqueKeys);
      requests.push({
        key: `prop_${keyIndex}`,
        virtualTimestampMs: vt,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: inBurst ? 30 + Math.random() * 70 : 15 + Math.random() * 25,
      });
    }
    return requests;
  }

  private static generateDrift(config: TrafficConfig): TrafficRequest[] {
    const requests: TrafficRequest[] = [];
    const virtualDurationMs = 600_000; // 10 min — más largo para que TTL expire
    const phases = 5;
    for (let i = 0; i < config.totalRequests; i++) {
      const phase = Math.floor((i / config.totalRequests) * phases);
      const phaseSize = Math.floor(config.uniqueKeys / phases);
      const phaseOffset = phase * phaseSize;
      const keyIndex = Math.random() < 0.7
        ? phaseOffset + Math.floor(Math.random() * phaseSize)
        : Math.floor(Math.random() * config.uniqueKeys);
      requests.push({
        key: `prop_${Math.min(keyIndex, config.uniqueKeys - 1)}`,
        virtualTimestampMs: (i / config.totalRequests) * virtualDurationMs,
        dataSizeBytes: 800 + Math.floor(Math.random() * 1500),
        dbLatencyMs: 15 + Math.random() * 25,
      });
    }
    return requests;
  }

  static generateData(key: string): any {
    return {
      id: key, name: `Propiedad ${key}`,
      price: Math.floor(Math.random() * 500000) + 50000,
      area: Math.floor(Math.random() * 300) + 30,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      location: { lat: 4.6 + Math.random() * 0.1, lng: -74.1 + Math.random() * 0.1, city: 'Bogotá' },
      description: 'Lorem ipsum dolor sit amet. '.repeat(10),
      images: Array.from({ length: 5 }, (_, i) => `https://cdn.example.com/${key}/img_${i}.jpg`),
      amenities: ['Parqueadero', 'Piscina', 'Gimnasio', 'Zonas verdes'].slice(0, Math.floor(Math.random() * 4) + 1),
      createdAt: new Date().toISOString(),
    };
  }
}
