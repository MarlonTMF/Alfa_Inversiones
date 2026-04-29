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
  @Output() seccionChange = new EventEmitter<string>();

  setSeccion(s: string) {
    this.seccionChange.emit(s);
  }

  getProgresoRecaudacion(): number {
    return 71.2; // Demo
  }

  getProgresoObra(): number {
    return 12; // Demo
  }
}
