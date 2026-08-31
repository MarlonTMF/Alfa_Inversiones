/**
 * GA-Cache: Ring Buffer — Cola Circular de Alto Rendimiento
 *
 * Estructura de datos de tamaño fijo para recolectar telemetría
 * sin introducir latencia. Escritura O(1), lectura batch.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface TelemetryEntry {
  /** Llave del recurso accedido */
  key: string;
  /** Si fue un acierto de caché */
  isHit: boolean;
  /** De dónde se sirvió el dato */
  source: 'L1' | 'L2' | 'ORIGIN';
  /** Latencia en milisegundos */
  latencyMs: number;
  /** Tamaño estimado del dato en bytes */
  dataSizeBytes: number;
  /** Timestamp Unix */
  timestamp: number;
}

// ─── Implementación ──────────────────────────────────────────────────────────

export class RingBuffer {
  private buffer: (TelemetryEntry | null)[];
  private head = 0;          // Posición de escritura
  private tail = 0;          // Posición de lectura
  private count = 0;         // Entradas ocupadas
  private readonly capacity: number;
  private totalWritten = 0;  // Total histórico de escrituras

  constructor(capacity: number = 4096) {
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(null);
  }

  /** Escribir una entrada (O(1)) — sobrescribe las más antiguas si está lleno */
  write(entry: TelemetryEntry): void {
    this.buffer[this.head] = entry;
    this.head = (this.head + 1) % this.capacity;
    this.totalWritten++;

    if (this.count < this.capacity) {
      this.count++;
    } else {
      // Buffer lleno: mover tail (sobrescribir más antiguo)
      this.tail = (this.tail + 1) % this.capacity;
    }
  }

  /**
   * Consumir todas las entradas pendientes (batch read).
   * Retorna las entradas y limpia el buffer.
   * Diseñado para que el Worker/GA las consuma de golpe.
   */
  drain(): TelemetryEntry[] {
    if (this.count === 0) return [];

    const entries: TelemetryEntry[] = [];
    let idx = this.tail;

    for (let i = 0; i < this.count; i++) {
      const entry = this.buffer[idx];
      if (entry) entries.push(entry);
      this.buffer[idx] = null;
      idx = (idx + 1) % this.capacity;
    }

    this.head = 0;
    this.tail = 0;
    this.count = 0;

    return entries;
  }

  /**
   * Leer sin consumir (peek) — útil para telemetría en vivo.
   * Retorna las últimas N entradas.
   */
  peek(n: number = 100): TelemetryEntry[] {
    const entries: TelemetryEntry[] = [];
    const start = this.count <= n
      ? this.tail
      : (this.head - n + this.capacity) % this.capacity;

    const limit = Math.min(n, this.count);
    let idx = start;

    for (let i = 0; i < limit; i++) {
      const entry = this.buffer[idx];
      if (entry) entries.push(entry);
      idx = (idx + 1) % this.capacity;
    }

    return entries;
  }

  /** Cuántas entradas hay actualmente */
  size(): number {
    return this.count;
  }

  /** Si el buffer está lleno */
  isFull(): boolean {
    return this.count >= this.capacity;
  }

  /** Si el buffer está vacío */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /** Capacidad total del buffer */
  getCapacity(): number {
    return this.capacity;
  }

  /** Total de escrituras históricas */
  getTotalWritten(): number {
    return this.totalWritten;
  }

  /** Reiniciar el buffer completamente */
  reset(): void {
    this.buffer = new Array(this.capacity).fill(null);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
    this.totalWritten = 0;
  }
}
