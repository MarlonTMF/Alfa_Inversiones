import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyecto-legal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class ProyectoLegal {
  @Input() proyecto: any;

  documentos = [
    { nombre: 'Escritura Pública de Terreno', estado: 'aprobado', fecha: '2024-01-15', responsable: 'Notaría 42' },
    { nombre: 'Permiso de Construcción Municipal', estado: 'pendiente', fecha: 'En trámite', responsable: 'Dpt. Legal' },
    { nombre: 'Estudio de Impacto Ambiental', estado: 'aprobado', fecha: '2024-02-10', responsable: 'EcoConsult' },
    { nombre: 'Contrato de Fideicomiso', estado: 'revision', fecha: '2024-03-01', responsable: 'Banco Atlas' }
  ];

  getBadgeClass(estado: string): string {
    if (estado === 'aprobado') return 'bg-green-900/30 text-green-400';
    if (estado === 'pendiente') return 'bg-red-900/30 text-red-400';
    return 'bg-yellow-900/30 text-yellow-400';
  }
}
