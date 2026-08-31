/**
 * GA-Cache: WebSocket Gateway — Observabilidad en Tiempo Real
 *
 * Emite eventos de evolución, métricas y benchmarks via Socket.io
 * para que el dashboard los consuma y actualice gráficos en vivo.
 */

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GenerationEvent } from './core/ga-engine';

@WebSocketGateway({
  namespace: '/ga-cache',
  cors: { origin: '*' },
})
export class GaCacheGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GaCacheGateway.name);

  @WebSocketServer()
  server!: Server;

  private connectedClients = 0;

  afterInit() {
    this.logger.log('📡 GA-Cache WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    this.connectedClients++;
    this.logger.verbose(`Cliente conectado: ${client.id} (total: ${this.connectedClients})`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--;
    this.logger.verbose(`Cliente desconectado: ${client.id} (total: ${this.connectedClients})`);
  }

  // ─── Emisión de Eventos ──────────────────────────────────────────────────

  /** Emitir cuando el GA completa una generación */
  emitGeneration(event: GenerationEvent): void {
    if (this.server) {
      this.server.emit('ga:generation', event);
    }
  }

  /** Emitir cuando se encuentra un nuevo mejor genoma */
  emitNewBest(chromosome: any): void {
    if (this.server) {
      this.server.emit('ga:newBest', chromosome);
    }
  }

  /** Emitir métricas periódicas de telemetría */
  emitMetrics(metrics: any): void {
    if (this.server) {
      this.server.emit('ga:metrics', metrics);
    }
  }

  /** Emitir resultado de benchmark */
  emitBenchmarkResult(result: any): void {
    if (this.server) {
      this.server.emit('ga:benchmark', result);
    }
  }

  /** Emitir progreso de benchmark */
  emitBenchmarkProgress(progress: { phase: string; percent: number }): void {
    if (this.server) {
      this.server.emit('ga:benchmarkProgress', progress);
    }
  }

  /** Número de clientes conectados */
  getConnectedClients(): number {
    return this.connectedClients;
  }
}
