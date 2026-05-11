import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyecto-nuevo-avance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-avance.html',
  styleUrl: './nuevo-avance.css'
})
export class ProyectoNuevoAvance {
  @Input() proyecto: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  hitos = [
    { id: 'cimientos', nombre: 'Cimientos', icono: 'architecture' },
    { id: 'estructura', nombre: 'Estructura', icono: 'domain' },
    { id: 'acabados', nombre: 'Acabados', icono: 'format_paint' },
    { id: 'servicios', nombre: 'Servicios', icono: 'bolt' }
  ];

  form = {
    hitoId: 'cimientos',
    titulo: '',
    descripcion: '',
    notificarInversores: true,
    publicarPortal: false,
    imagenes: [] as any[]
  };

  seleccionarHito(id: string): void {
    this.form.hitoId = id;
  }

  manejarImagenes(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.imagenes.push(files[i]);
      }
    }
  }

  publicar(): void {
    if (this.form.titulo && this.form.descripcion) {
      this.guardar.emit(this.form);
    }
  }
}
