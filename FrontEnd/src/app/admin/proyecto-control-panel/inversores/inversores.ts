import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyecto-inversores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inversores.html',
  styleUrl: './inversores.css'
})
export class ProyectoInversores {
  @Input() proyecto: any;
  @Input() inversiones: any[] = [];

  readonly porPagina = 8;
  paginaActual = 1;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.inversiones.length / this.porPagina));
  }

  get inversionesPagina(): any[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.inversiones.slice(inicio, inicio + this.porPagina);
  }

  get numerosPagina(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(n: number): void {
    this.paginaActual = Math.min(this.totalPaginas, Math.max(1, n));
  }

  paginaAnterior(): void {
    this.irAPagina(this.paginaActual - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual + 1);
  }

  /** Exporta las inversiones ya cargadas a CSV; no hay endpoint de reporte en el backend. */
  exportarDatos(): void {
    if (!this.inversiones.length) {
      return;
    }
    const filas = [
      ['Inversionista', 'Monto (USD)', 'Estado'],
      ...this.inversiones.map((inv) => [
        inv.inversor?.nombre || '',
        String(inv.monto ?? ''),
        'Activo',
      ]),
    ];
    const csv = filas.map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inversores-${this.proyecto?.nombre || 'proyecto'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
