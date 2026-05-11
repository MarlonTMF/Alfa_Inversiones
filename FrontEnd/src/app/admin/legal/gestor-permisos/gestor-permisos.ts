import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestor-permisos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestor-permisos.html',
  styleUrl: './gestor-permisos.css'
})
export class GestorPermisos {
  faseActual = 'Pre-operativa'; // Pre-operativa, Operativa, Cierre

  permisos = [
    { 
      id: 1, 
      expediente: '#104-A', 
      titulo: 'Certificado de Títulos', 
      ente: 'Dirección General de Catastro', 
      estado: 'Vigente', 
      emision: '12 Oct 2023', 
      caducidad: '12 Oct 2025',
      validado: true,
      tipo: 'completado'
    },
    { 
      id: 2, 
      expediente: '#109-B', 
      titulo: 'Factibilidad de Servicios Públicos', 
      ente: 'Secretaría de Infraestructura', 
      estado: 'Pendiente', 
      solicitado: '05 Ene 2024', 
      estimado: '15 Feb 2024',
      validado: false,
      tipo: 'pendiente'
    },
    { 
      id: 3, 
      titulo: 'Uso de Suelo & Impacto Ambiental', 
      proximo: true,
      tipo: 'futuro'
    }
  ];

  actividades = [
    { titulo: 'Firma de Notaría - Títulos', tiempo: 'Hace 2h' },
    { titulo: 'Actualización de Licencia de Obra', tiempo: 'Ayer' }
  ];

  setFase(fase: string): void {
    this.faseActual = fase;
  }
}
