import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyecto-registro-inversor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-inversor.html',
  styleUrl: './registro-inversor.css'
})
export class ProyectoRegistroInversor {
  @Input() proyecto: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() finalizado = new EventEmitter<any>();

  pasoActual = 1;
  
  form = {
    nombre: '',
    email: '',
    telefono: '',
    pais: '',
    capital: 250000,
    intereses: [] as string[],
    frecuencia: 'Trimestral',
    documentos: [] as any[]
  };

  interesesOpciones = [
    { id: 'residencial', nombre: 'Residencial', subtitulo: 'Casas & Deptos', icono: 'home_work' },
    { id: 'comercial', nombre: 'Comercial', subtitulo: 'Oficinas & Locales', icono: 'corporate_fare' },
    { id: 'lotes', nombre: 'Lotes', subtitulo: 'Terrenos & Urbanos', icono: 'landscape' }
  ];

  nextStep(): void {
    if (this.pasoActual < 4) {
      this.pasoActual++;
      
      // Generar email automático si llegamos al final
      if (this.pasoActual === 4 && this.form.nombre) {
        const cleanName = this.form.nombre.toLowerCase().replace(/\s+/g, '.');
        this.form.email = `${cleanName}@company.com`;
      }
    }
  }

  prevStep(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  toggleInteres(id: string): void {
    const index = this.form.intereses.indexOf(id);
    if (index === -1) {
      this.form.intereses.push(id);
    } else {
      this.form.intereses.splice(index, 1);
    }
  }

  isInteresSelected(id: string): boolean {
    return this.form.intereses.includes(id);
  }

  seleccionarFrecuencia(f: string): void {
    this.form.frecuencia = f;
  }

  finalizar(): void {
    this.finalizado.emit(this.form);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
