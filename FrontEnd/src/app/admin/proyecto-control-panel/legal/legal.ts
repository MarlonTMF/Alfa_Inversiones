import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProyectoService } from '../../../core/services/proyecto.service';

@Component({
  selector: 'app-proyecto-legal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class ProyectoLegal implements OnInit {
  @Input() proyecto: any;
  
  private readonly proyectoService = inject(ProyectoService);
  private readonly cdr = inject(ChangeDetectorRef);

  vistaActual: 'consola' | 'operativa' | 'timeline' = 'consola';
  faseTimeline = 'Pre-operativa';
  documentos: any[] = [];
  
  stats = {
    salud: 0,
    pendientes: 0,
    vencidos: 0
  };

  categorias: any[] = [];

  ngOnInit(): void {
    if (this.proyecto?.id) {
      this.cargarDocumentos();
    }
  }

  cargarDocumentos(): void {
    this.proyectoService.listarDocumentos(this.proyecto.id).subscribe({
      next: (data) => {
        this.documentos = data;
        this.calcularEstadisticas();
        this.agruparPorCategorias();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando documentos', err)
    });
  }

  calcularEstadisticas(): void {
    const total = this.documentos.length;
    if (total === 0) {
      this.stats = { salud: 0, pendientes: 0, vencidos: 0 };
      return;
    }
    const vigentes = this.documentos.filter(d => d.estado === 'vigente').length;
    this.stats = {
      salud: Math.round((vigentes / total) * 100),
      pendientes: this.documentos.filter(d => d.estado === 'pendiente').length,
      vencidos: this.documentos.filter(d => d.estado === 'vencido').length
    };
  }

  agruparPorCategorias(): void {
    // Agrupación simulada por tipos de documentos comunes
    const cats = [
      { nombre: 'Permisos', docs: this.documentos.filter(d => d.nombre.toLowerCase().includes('permiso') || d.nombre.toLowerCase().includes('licencia')) },
      { nombre: 'Contratos', docs: this.documentos.filter(d => d.nombre.toLowerCase().includes('contrato') || d.nombre.toLowerCase().includes('acuerdo')) },
      { nombre: 'Técnicos', docs: this.documentos.filter(d => !d.nombre.toLowerCase().includes('permiso') && !d.nombre.toLowerCase().includes('contrato')) }
    ];
    
    this.categorias = cats.map(c => ({
      nombre: c.nombre,
      progreso: c.docs.length > 0 ? Math.round((c.docs.filter(d => d.estado === 'vigente').length / c.docs.length) * 100) : 0,
      cantidad: c.docs.length
    }));
  }

  // Propiedades para compatibilidad con el HTML (Vistas Operativa y Timeline)

  /**
   * El banner de alerta critica mostraba un mensaje fijo ("Documentación en
   * regla y vigente") con estilo rojo urgente y un boton "Subsanar": el
   * texto decia que todo estaba bien pero la tarjeta entera exigia accion
   * inmediata. Ahora sale de los documentos reales marcados vencido, y solo
   * aparece cuando de verdad hay algo que subsanar.
   */
  get alertasCriticas(): any[] {
    const vencidos = this.documentos.filter((d) => d.estado === 'vencido');
    if (!vencidos.length) {
      return [];
    }
    return [{
      titulo: vencidos.length === 1 ? vencidos[0].nombre : `${vencidos.length} documentos vencidos`,
      mensaje: vencidos.length === 1
        ? 'Este documento venció y necesita renovarse.'
        : 'Hay documentos vencidos que necesitan renovarse.',
    }];
  }

  subsanarAlerta(): void {
    this.filtroEstado = 'vencido';
    this.vistaActual = 'consola';
  }

  firmas = [
    { rol: 'Director General', estado: 'Firmado', icono: 'check_circle', color: 'text-brand' },
    { rol: 'Inversor Principal', estado: 'Pendiente', icono: 'pending', color: 'text-slate-500' }
  ];

  permisosTimeline = [
    { expediente: '#104-A', titulo: 'Certificado de Títulos', tipo: 'completado' },
    { expediente: '#109-B', titulo: 'Factibilidad de Servicios', tipo: 'pendiente' }
  ];

  setVista(v: 'consola' | 'operativa' | 'timeline'): void {
    this.vistaActual = v;
  }

  setFase(f: string): void {
    this.faseTimeline = f;
  }

  /** Ciclo de filtro sobre el checklist: todos -> pendientes -> vencidos -> todos. */
  filtroEstado: 'todos' | 'pendiente' | 'vencido' = 'todos';

  cicloFiltro(): void {
    this.filtroEstado =
      this.filtroEstado === 'todos' ? 'pendiente' : this.filtroEstado === 'pendiente' ? 'vencido' : 'todos';
  }

  get documentosFiltrados(): any[] {
    const base =
      this.filtroEstado === 'todos'
        ? this.documentos
        : this.documentos.filter((d) => d.estado === this.filtroEstado);
    return [...base].sort((a, b) => {
      const fa = new Date(a.createdAt || 0).getTime();
      const fb = new Date(b.createdAt || 0).getTime();
      return this.ordenAscendente ? fa - fb : fb - fa;
    });
  }

  ordenAscendente = false;

  alternarOrden(): void {
    this.ordenAscendente = !this.ordenAscendente;
  }
}
