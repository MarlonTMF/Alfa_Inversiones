import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-consola',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal-consola.html',
  styleUrl: './legal-consola.css'
})
export class LegalConsola {
  stats = [
    { label: 'Salud Legal Global', value: '94.2', unit: '%', trend: '+2.4%', color: 'primary' },
    { label: 'Revisiones Pendientes', value: '18', unit: '', detail: 'Asignadas al equipo legal', color: 'surface' },
    { label: 'Documentos Vencidos', value: '04', unit: '', detail: 'Prioridad Crítica', color: 'error' }
  ];

  tareasPendientes = [
    { 
      id: 1, 
      titulo: 'Certificación de Impacto Ambiental', 
      proyecto: 'Torres del Prado', 
      categoria: 'Ambiental', 
      estado: 'Vencido', 
      fecha: '12 Oct 2023',
      icono: 'eco'
    },
    { 
      id: 2, 
      titulo: 'Auditoría de Integridad Estructural', 
      proyecto: 'Residencias del Urubó', 
      categoria: 'Estructural', 
      estado: 'Pendiente', 
      fecha: '18 Oct 2023',
      icono: 'architecture'
    },
    { 
      id: 3, 
      titulo: 'Protocolo de Seguridad V2', 
      proyecto: 'Condominio Los Tajibos', 
      categoria: 'Operacional', 
      estado: 'Nuevo', 
      fecha: '22 Oct 2023',
      icono: 'policy'
    }
  ];

  categorias = [
    { nombre: 'Ambiental', porcentaje: 88 },
    { nombre: 'Estructural', porcentaje: 96 },
    { nombre: 'Financiero', porcentaje: 100 }
  ];
}
