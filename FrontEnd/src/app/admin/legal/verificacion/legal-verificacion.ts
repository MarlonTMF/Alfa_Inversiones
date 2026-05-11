import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-verificacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './legal-verificacion.html',
  styleUrl: './legal-verificacion.css'
})
export class LegalVerificacion {
  documento = {
    nombre: 'Serie A Term Sheet',
    proyecto: 'Apex Global Infrastructure II',
    version: 'v2.4.0',
    tipo: 'PDF',
    subidoPor: 'Jonathan Davis',
    cargo: 'Global Operations Lead',
    fecha: 'Octubre 24, 2023',
    hora: '14:22 GMT',
    hash: 'SHA-256: 8f3d...e29c'
  };

  comentarios = '';

  aprobar(): void {
    console.log('Documento aprobado:', this.comentarios);
    // Navegar de vuelta a la consola
  }

  rechazar(): void {
    console.log('Documento rechazado:', this.comentarios);
  }
}
