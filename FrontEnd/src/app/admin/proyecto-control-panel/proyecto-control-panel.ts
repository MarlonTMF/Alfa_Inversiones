import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { ProyectoResumen } from './resumen/resumen';
import { ProyectoPlanificacion } from './planificacion/planificacion';
import { ProyectoLegal } from './legal/legal';
import { ProyectoBitacora } from './bitacora/bitacora';
import { ProyectoInversores } from './inversores/inversores';

@Component({
  selector: 'app-proyecto-control-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLink,
    ProyectoResumen,
    ProyectoPlanificacion,
    ProyectoLegal,
    ProyectoBitacora,
    ProyectoInversores
  ],
  templateUrl: './proyecto-control-panel.html',
  styleUrl: './proyecto-control-panel.css'
})
export class ProyectoControlPanel implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly proyectoService = inject(ProyectoService);
  private readonly cdr = inject(ChangeDetectorRef);

  proyectoId: string | null = null;
  proyecto: any = null;
  dashboard: any = null;
  docCount: number = 0;
  multimediaCount: number = 0;
  fases: any[] = [];
  seccionActual: string = 'resumen'; // resumen, planificacion, legal, bitacora, inversores

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id');
    if (this.proyectoId) {
      this.cargarTodo(this.proyectoId);
    }
  }

  cargarTodo(id: string): void {
    // 1. Datos Básicos
    this.proyectoService.obtenerProyecto(id).subscribe({
      next: (data) => {
        this.proyecto = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando proyecto', err)
    });

    // 2. Dashboard Financiero
    this.proyectoService.obtenerDashboard(id).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.cdr.detectChanges();
      }
    });

    // 3. Documentos (Conteo)
    this.proyectoService.listarDocumentos(id).subscribe({
      next: (docs) => {
        this.docCount = docs.length;
        this.cdr.detectChanges();
      }
    });

    // 4. Multimedia (Conteo y Main)
    this.proyectoService.listarMultimedia(id).subscribe({
      next: (items) => {
        this.multimediaCount = items.length;
        this.cdr.detectChanges();
      }
    });

    // 5. Fases
    this.proyectoService.listarFases(id).subscribe({
      next: (items) => {
        this.fases = items;
        this.cdr.detectChanges();
      }
    });
  }

  setSeccion(s: string): void {
    this.seccionActual = s;
  }
}
