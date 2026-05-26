import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-proyecto-resumen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css'
})
export class ProyectoResumen {
  @Input() proyecto: any;
  @Input() dashboard: any;
  @Input() docCount: number = 0;
  @Input() multimediaCount: number = 0;
  @Input() fases: any[] = [];
  @Output() seccionChange = new EventEmitter<string>();

  setSeccion(s: string) {
    this.seccionChange.emit(s);
  }

  getCapitalRecaudado(): number {
    if (!this.proyecto?.inversiones) return 0;
    return this.proyecto.inversiones.reduce((acc: number, inv: any) => acc + Number(inv.monto), 0);
  }

  getMetaRecaudacion(): number {
    return Number(this.proyecto?.precioVentaTotal || this.proyecto?.precioVentaEstimado || 0);
  }

  getProgresoRecaudacion(): number {
    const total = this.getCapitalRecaudado();
    const meta = this.getMetaRecaudacion();
    if (meta === 0) return 0;
    return Math.min(100, (total / meta) * 100);
  }

  getProgresoObra(): number {
    if (!this.fases || this.fases.length === 0) return 0;
    const completadas = this.fases.filter(f => f.estado === 'completado').length;
    return Math.round((completadas / this.fases.length) * 100);
  }

  getFaseActualLabel(): string {
    if (!this.fases || this.fases.length === 0) return 'Sin Fases';
    const actual = this.fases.find(f => f.estado === 'en_progreso');
    return actual ? actual.nombre : 'Planeación';
  }
}
