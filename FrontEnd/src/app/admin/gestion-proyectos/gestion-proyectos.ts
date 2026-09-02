import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { AuthService } from '../../auth/services/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gestion-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gestion-proyectos.html',
  styleUrl: './gestion-proyectos.css',
})
export class GestionProyectos implements OnInit {
  private readonly proyectoService = inject(ProyectoService);
  public readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  cargando = false;
  error: string | null = null;
  proyectos: any[] = [];
  proyectosFiltrados: any[] = [];
  filtroActual: string = 'Todos';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = null;

    this.proyectoService.listarProyectos().subscribe({
      next: (data) => {
        this.proyectos = data ?? [];
        this.aplicarFiltro();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        const id = this.authService.usuarioActual()?.id;

        if (!id) {
          this.error =
            'Falta `id` de admin en sesión. Cierra sesión e inicia sesión de nuevo.';
          this.cargando = false;
          this.cdr.detectChanges();
          return;
        }

        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.error = '401: x-admin-id inválido o usuario no existe en la DB.';
          } else if (err.status === 403) {
            this.error = '403: tu usuario no tiene rol admin/super-admin en la DB.';
          } else {
            this.error = `${err.status || 'Error'}: No se pudo cargar proyectos.`;
          }
        } else {
          this.error =
            'No se pudo cargar proyectos. Verifica: 1) que el BackEnd esté arriba 2) que la tabla de proyectos exista 3) que no haya errores de CORS o Network.';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  aplicarFiltro(): void {
    if (this.filtroActual === 'Todos') {
      this.proyectosFiltrados = [...this.proyectos];
    } else if (this.filtroActual === 'Recaudación') {
      this.proyectosFiltrados = this.proyectos.filter(p => p.estado === 'planificacion');
    } else if (this.filtroActual === 'Construcción') {
      this.proyectosFiltrados = this.proyectos.filter(p => p.estado === 'en_construccion');
    } else if (this.filtroActual === 'Finalizados') {
      this.proyectosFiltrados = this.proyectos.filter(p => p.estado === 'completado');
    }
  }

  setFiltro(f: string): void {
    this.filtroActual = f;
    this.aplicarFiltro();
  }

  getProgreso(p: any): number {
    if (p.estado === 'planificacion') {
      // Simulación de recaudación: 70% si tiene ROI, sino 20%
      return p.roi ? 70 : 20;
    }
    if (p.estado === 'en_construccion') return 45;
    if (p.estado === 'completado') return 100;
    return 10;
  }

  getLabelProgreso(p: any): string {
    if (p.estado === 'planificacion') return 'Capital Recaudado';
    if (p.estado === 'en_construccion') return 'Avance de Obra';
    return 'Progreso';
  }

  getBadgeClass(p: any): string {
    if (p.estado === 'planificacion') return 'badge-recaudacion';
    if (p.estado === 'en_construccion') return 'badge-construccion';
    if (p.estado === 'completado') return 'badge-finalizado';
    return 'badge-planificacion';
  }

  getEstadoLabel(p: any): string {
    const labels: any = {
      'planificacion': 'EN RECAUDACIÓN',
      'en_construccion': 'EN CONSTRUCCIÓN',
      'completado': 'FINALIZADO',
      'suspendido': 'SUSPENDIDO'
    };
    return labels[p.estado] || 'PLANEACIÓN';
  }

  getImagen(p: any): string {
    // Si la propiedad tiene imágenes, usar la primera.
    if (p.property?.multimedia && p.property.multimedia.length > 0) {
      return p.property.multimedia[0].url;
    }
    // Placeholders elegantes
    if (p.tipoProyecto === 'residencial') return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800';
  }
}
