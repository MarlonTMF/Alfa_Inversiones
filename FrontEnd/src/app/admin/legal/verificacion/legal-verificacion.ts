import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type EstadoDocumento = 'pendiente' | 'aprobado' | 'rechazado';

@Component({
  selector: 'app-legal-verificacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './legal-verificacion.html',
  styleUrl: './legal-verificacion.css'
})
export class LegalVerificacion {
  documento = {
    nombre: 'Acta de Constitución de Sociedad',
    proyecto: 'Torres del Prado',
    version: 'v2.4.0',
    tipo: 'PDF',
    subidoPor: 'Rodrigo Áñez',
    cargo: 'Jefe de Operaciones',
    fecha: 'Octubre 24, 2023',
    hora: '14:22 GMT',
    hash: 'SHA-256: 8f3d...e29c'
  };

  comentarios = '';
  estado: EstadoDocumento = 'pendiente';

  private static readonly ZOOM_MIN = 0.75;
  private static readonly ZOOM_MAX = 1.5;
  zoom = 1;

  acercar(): void {
    this.zoom = Math.min(LegalVerificacion.ZOOM_MAX, +(this.zoom + 0.1).toFixed(2));
  }

  alejar(): void {
    this.zoom = Math.max(LegalVerificacion.ZOOM_MIN, +(this.zoom - 0.1).toFixed(2));
  }

  imprimir(): void {
    window.print();
  }

  aprobar(): void {
    this.estado = 'aprobado';
  }

  rechazar(): void {
    if (!this.comentarios.trim()) {
      return; // rechazar exige explicar por que, para que quien sube el documento sepa que corregir
    }
    this.estado = 'rechazado';
  }
}
