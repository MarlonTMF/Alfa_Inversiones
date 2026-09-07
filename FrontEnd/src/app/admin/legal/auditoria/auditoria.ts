import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type DecisionAuditoria = 'aprobar' | 'subsanar' | 'rechazar';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css'
})
export class Auditoria {
  tramiteId = '#88291-XA';
  documentoNombre = 'ESTADO_CUENTA_Q3_2023.PDF';
  comentarios = '';

  /** Decisión elegida en el grupo Aprobar/Subsanar/Rechazar; null = ninguna aún. */
  decision: DecisionAuditoria | null = null;
  auditoriaConfirmada = false;

  @ViewChild('visorDocumento') visorDocumento?: ElementRef<HTMLElement>;

  historial = [
    { evento: 'Documento Subido', fecha: '12 Oct, 09:45', detalle: 'Usuario: Cliente_4402 (Web Portal)', color: 'primary' },
    { evento: 'Validación Automática OCR', fecha: '12 Oct, 09:46', detalle: 'Resultado: Legibilidad 98% - Pendiente firma humana.', color: 'outline' },
    { evento: 'Asignado a Auditoría', fecha: '12 Oct, 10:15', detalle: 'Responsable: Alejandro Vargas (Senior Analyst)', color: 'tertiary' }
  ];

  elegirDecision(d: DecisionAuditoria): void {
    this.decision = d;
    this.auditoriaConfirmada = false;
  }

  /**
   * No hay backend real detrás de esta vista de demostración: la decisión
   * queda registrada en el historial local, visible de inmediato, en vez de
   * limitarse a un console.log que el auditor nunca llega a ver.
   */
  confirmar(): void {
    if (!this.decision) {
      return;
    }
    const etiquetas: Record<DecisionAuditoria, string> = {
      aprobar: 'Auditoría Aprobada',
      subsanar: 'Enviado a Subsanar',
      rechazar: 'Auditoría Rechazada',
    };
    const colores: Record<DecisionAuditoria, string> = {
      aprobar: 'primary',
      subsanar: 'tertiary',
      rechazar: 'error',
    };
    this.historial.unshift({
      evento: etiquetas[this.decision],
      fecha: new Date().toLocaleString('es-BO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      detalle: this.comentarios.trim() || 'Sin comentarios adicionales.',
      color: colores[this.decision],
    });
    this.auditoriaConfirmada = true;
    this.comentarios = '';
    this.decision = null;
  }

  alternarPantallaCompleta(): void {
    const el = this.visorDocumento?.nativeElement;
    if (!el) {
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }
}
