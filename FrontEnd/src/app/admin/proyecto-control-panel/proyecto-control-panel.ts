import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { ProyectoResumen } from './resumen/resumen';
import { ProyectoLegal } from './legal/legal';
import { ProyectoBitacora } from './bitacora/bitacora';
import { ProyectoInversores } from './inversores/inversores';

@Component({
  selector: 'app-proyecto-control-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ProyectoResumen,
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

  proyectoId: string | null = null;
  proyecto: any = null;
  seccionActual: string = 'resumen'; // resumen, legal, bitacora, inversores

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id');
    if (this.proyectoId) {
      this.cargarProyecto(this.proyectoId);
    }
  }

  cargarProyecto(id: string): void {
    this.proyectoService.obtenerProyecto(id).subscribe({
      next: (data) => {
        this.proyecto = data;
      },
      error: (err) => console.error('Error cargando proyecto', err)
    });
  }

  setSeccion(s: string): void {
    this.seccionActual = s;
  }
}
