import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-inversion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro-inversion.html',
  styleUrl: './registro-inversion.css'
})
export class RegistroInversion {
  pasoActual = 1;

  form = {
    proyectoId: '',
    inversorId: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    archivo: null as File | null
  };

  proyectos = [
    { id: '1', nombre: 'Zenith Skyline Hub', categoria: 'Mixed-Use Commercial', imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzZKnuZodUWuOS5yP321QF05hUNOhxy36er7usg7Es346CPu5S-C-tSpA0wfXefUXWkKPCyDAjwdNqhsUcKIXSrMLRxcXLHPoHG5W4AX8LhtoQ1ZcWCJ3h894bl290vuE7d4P11HNlofFoKSYgkbhJtnJAhCifg3VWsZVxm53QbkvTbio33-EbZ8mY9gt2NB47zFEfSUrqkuBasZM7eBVSeueHMsc24y5-3eroG1AcSeGrwpxvmRUVkDvOmfgfMmuQtK93NYkqJCYO' },
    { id: '2', nombre: 'Torre Los Alpes', categoria: 'Residencial', imagen: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400' }
  ];

  inversores = [
    { id: '1', nombre: 'Alexander Vance', empresa: 'Vance Institutional Holdings', imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxAeaCj3k3GwRfd2InbT_zev1d7vpdn-NRU6VjfbTU0_QrF8uKTx5aokY_FyRkhbTmFE_KQLBdImwHSUKPQY3f-fDmMCrPG1dm5zXAFoGes-ocAbSaiexrna_bRrldN-geUVbu-A2JzcBqIQN4dWhjAh_5ajaIn3oESjLwnlAhoJE_L83i7KQfCP-bK8-hHBTMK3rOfuFZCcnhG9b0XQoGEbx1oHG-PDJGRMAsWHArYIjYj_n2cu3wGMSeoHLTpYMKiaHhTLNCAi9L' },
    { id: '2', nombre: 'Elena Rodriguez', empresa: 'Private Equity Group', imagen: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' }
  ];

  proyectoSeleccionado: any = null;
  inversorSeleccionado: any = null;

  constructor() {
    // Inicializar con el primero por defecto para el mock
    this.proyectoSeleccionado = this.proyectos[0];
    this.inversorSeleccionado = this.inversores[0];
  }

  seleccionarProyecto(p: any): void {
    this.proyectoSeleccionado = p;
    this.form.proyectoId = p.id;
  }

  seleccionarInversor(i: any): void {
    this.inversorSeleccionado = i;
    this.form.inversorId = i.id;
  }

  nextStep(): void {
    if (this.pasoActual < 2) {
      this.pasoActual++;
    }
  }

  prevStep(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.form.archivo = file;
    }
  }

  finalizarRegistro(): void {
    console.log('Inversión Registrada:', this.form);
    this.pasoActual = 3; // Éxito
  }
}
