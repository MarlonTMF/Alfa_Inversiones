import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-expediente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal-expediente.html',
  styleUrl: './legal-expediente.css'
})
export class LegalExpediente {
  @Input() proyectoId: string = '';

  permisos = [
    { 
      id: 1, 
      nombre: 'Licencia de Edificación', 
      estado: 'Aprobado', 
      vencimiento: '12 Ene 2025', 
      progreso: 100,
      icono: 'verified'
    },
    { 
      id: 2, 
      nombre: 'Factibilidad de Agua y Alcantarillado', 
      estado: 'Aprobado', 
      vencimiento: 'N/A', 
      progreso: 100,
      icono: 'water_drop'
    },
    { 
      id: 3, 
      nombre: 'Certificado de Impacto Ambiental', 
      estado: 'Pendiente', 
      vencimiento: '15 Oct 2024', 
      progreso: 65,
      icono: 'eco'
    }
  ];

  contratos = [
    { id: 'C1', inversor: 'Alexander Vance', monto: '$1,250,000', estado: 'Firmado', fecha: '24 Oct 2023' },
    { id: 'C2', inversor: 'Nordic Wealth Fund', monto: '$5,000,000', estado: 'Pendiente', fecha: '02 Nov 2023' }
  ];

  alertas = [
    { tipo: 'critica', mensaje: 'Licencia de Construcción expira en 30 días.' },
    { tipo: 'info', mensaje: 'Nueva versión del contrato de fideicomiso subida.' }
  ];
}
