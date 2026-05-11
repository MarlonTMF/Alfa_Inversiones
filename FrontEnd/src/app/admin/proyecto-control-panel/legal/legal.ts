import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyecto-legal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class ProyectoLegal {
  @Input() proyecto: any;
  
  // Control de Vistas: consola (Salud Legal), operativa (Contratos/Alertas), timeline (Procesos)
  vistaActual: 'consola' | 'operativa' | 'timeline' = 'consola';
  faseTimeline = 'Pre-operativa';

  // --- DATOS VISTA CONSOLA (KPIs e Índice) ---
  stats = {
    salud: 94.2,
    pendientes: 18,
    vencidos: 4
  };

  categorias = [
    { nombre: 'Ambiental', progreso: 88 },
    { nombre: 'Estructural', progreso: 96 },
    { nombre: 'Financiero', progreso: 100 }
  ];

  accionesRequeridas = [
    { 
      id: 1, 
      titulo: 'Renovación Certificación EIA', 
      estado: 'Vencido', 
      categoria: 'Ambiental', 
      fecha: '12 Oct 2023', 
      icono: 'eco',
      critico: true
    },
    { 
      id: 2, 
      titulo: 'Auditoría de Integridad Estructural', 
      estado: 'Requiere Revisión', 
      categoria: 'Estructural', 
      fecha: '18 Oct 2023', 
      icono: 'architecture',
      critico: false
    }
  ];

  // --- DATOS VISTA OPERATIVA (Contratos e Inversores) ---
  alertasCriticas = [
    { 
      titulo: 'Licencia de Construcción Vencida', 
      mensaje: 'Las operaciones administrativas han sido suspendidas por falta de vigencia en la licencia #EXP-2938.' 
    }
  ];

  firmas = [
    { rol: 'Director General', estado: 'Firmado', icono: 'check_circle', color: 'text-[#3b82f6]' },
    { rol: 'Inversor Principal', estado: 'Pendiente', icono: 'pending', color: 'text-slate-500' },
    { rol: 'Líder de Cumplimiento', estado: 'En Espera', icono: 'pending', color: 'text-slate-500' }
  ];

  contratosInversores = [
    { id: 'C1', inversor: 'Alexander Vance', monto: '$1,250,000', estado: 'Firmado', fecha: '24 Oct 2023' },
    { id: 'C2', inversor: 'Nordic Wealth Fund', monto: '$5,000,000', estado: 'Pendiente', fecha: '02 Nov 2023' }
  ];

  // --- DATOS VISTA TIMELINE (Gestor Dinámico) ---
  permisosTimeline = [
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
    }
  ];

  setVista(v: 'consola' | 'operativa' | 'timeline'): void {
    this.vistaActual = v;
  }

  setFase(f: string): void {
    this.faseTimeline = f;
  }
}
