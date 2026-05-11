import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoNuevoAvance } from './nuevo-avance/nuevo-avance';

@Component({
  selector: 'app-proyecto-bitacora',
  standalone: true,
  imports: [CommonModule, ProyectoNuevoAvance],
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css'
})
export class ProyectoBitacora {
  @Input() proyecto: any;
  mostrarModalNuevaEntrada = false;

  abrirNuevaEntrada(): void {
    this.mostrarModalNuevaEntrada = true;
  }

  cerrarNuevaEntrada(): void {
    this.mostrarModalNuevaEntrada = false;
  }

  guardarEntrada(datos: any): void {
    console.log('Guardando avance:', datos);
    // Simulación de guardado
    this.entradas.unshift({
      fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      autor: 'Admin (MOCK)',
      imagen: 'https://images.unsplash.com/photo-1541915059199-ed5fd51d4955?auto=format&fit=crop&q=80&w=800'
    });
    this.cerrarNuevaEntrada();
  }

  entradas = [
    {
      fecha: '28 de Marzo, 2024',
      titulo: 'Finalización de Cimentación Profunda',
      descripcion: 'Se ha concluido la fase de colado de los 42 pilotes estructurales. Se inicia preparación para losas de sótano.',
      autor: 'Ing. Carlos Mendoza',
      imagen: 'https://images.unsplash.com/photo-1541915059199-ed5fd51d4955?auto=format&fit=crop&q=80&w=800'
    },
    {
      fecha: '15 de Marzo, 2024',
      titulo: 'Inspección de Armado de Acero',
      descripcion: 'Revisión estructural satisfactoria del refuerzo en zona norte. Cumplimiento del 100% de la norma técnica.',
      autor: 'Arq. Elena Rivas',
      imagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
    }
  ];
}
