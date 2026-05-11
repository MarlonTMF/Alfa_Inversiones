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

  hitos: any[] = [
    { nombre: 'Cierre de Terreno', fecha: '2024-06-15', estado: 'completado', critico: true },
    { nombre: 'Aprobación de Planos', fecha: '2024-08-20', estado: 'en-progreso', critico: true },
    { nombre: 'Lanzamiento Comercial', fecha: '2024-09-10', estado: 'pendiente', critico: false },
    { nombre: 'Inicio de Obra', fecha: '2024-11-05', estado: 'pendiente', critico: true }
  ];

  nuevoHito = { nombre: '', fecha: '', critico: false };

  ngOnInit(): void {
    if (this.proyecto?.hitos && this.proyecto.hitos.length > 0) {
      this.hitos = this.proyecto.hitos;
    }
  }

  agregarHito(): void {
    if (this.nuevoHito.nombre && this.nuevoHito.fecha) {
      this.hitos.push({ ...this.nuevoHito, estado: 'pendiente' });
      this.nuevoHito = { nombre: '', fecha: '', critico: false };
    }
  }

  eliminarHito(index: number): void {
    this.hitos.splice(index, 1);
  }

  getProgresoPlanificacion(): number {
    if (this.hitos.length === 0) return 0;
    const completados = this.hitos.filter(h => h.estado === 'completado').length;
    return (completados / this.hitos.length) * 100;
  }
}
