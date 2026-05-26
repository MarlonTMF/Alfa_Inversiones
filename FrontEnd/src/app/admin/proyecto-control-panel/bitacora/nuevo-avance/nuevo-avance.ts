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
  @Input() fases: any[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  form = {
    faseId: '',
    titulo: '',
    descripcion: '',
    porcentajeAvance: 0,
    notificarInversores: true,
    publicarPortal: false,
    imagenes: [] as any[]
  };

  ngOnInit(): void {
    if (this.fases && this.fases.length > 0) {
      this.form.faseId = this.fases[0].id;
      // Por defecto sugerimos el progreso actual de la fase
      this.form.porcentajeAvance = this.fases[0].progreso;
    }
  }

  seleccionarFase(id: string): void {
    this.form.faseId = id;
    const fase = this.fases.find(f => f.id === id);
    if (fase) {
      this.form.porcentajeAvance = fase.progreso;
    }
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
