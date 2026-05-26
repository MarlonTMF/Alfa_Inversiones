import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyecto-planificacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planificacion.html',
  styleUrl: './planificacion.css'
})
export class ProyectoPlanificacion implements OnInit {
  @Input() proyecto: any;
  @Input() fases: any[] = [];

  ngOnInit(): void {
    // Las fases vienen del padre
  }

  getProgresoPlanificacion(): number {
    if (!this.fases || this.fases.length === 0) return 0;
    const completados = this.fases.filter(f => f.estado === 'completado').length;
    return (completados / this.fases.length) * 100;
  }
}
