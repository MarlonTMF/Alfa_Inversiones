import { Component, Input, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoNuevoAvance } from './nuevo-avance/nuevo-avance';
import { ProyectoService } from '../../../core/services/proyecto.service';
import { imagenPrincipal } from '../../../core/media';

@Component({
  selector: 'app-proyecto-bitacora',
  standalone: true,
  imports: [CommonModule, ProyectoNuevoAvance],
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css'
})
export class ProyectoBitacora implements OnInit {
  @Input() proyecto: any;
  @Input() fases: any[] = [];
  
  private readonly proyectoService = inject(ProyectoService);
  private readonly cdr = inject(ChangeDetectorRef);

  entradas: any[] = [];
  mostrarModalNuevaEntrada = false;

  ngOnInit(): void {
    if (this.proyecto?.id) {
      this.cargarAvances();
    }
  }

  cargarAvances(): void {
    this.proyectoService.listarAvances(this.proyecto.id).subscribe({
      next: (data) => {
        this.entradas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando avances', err)
    });
  }

  abrirNuevaEntrada(): void {
    this.mostrarModalNuevaEntrada = true;
  }

  cerrarNuevaEntrada(): void {
    this.mostrarModalNuevaEntrada = false;
  }

  guardarEntrada(datos: any): void {
    const payload = {
      faseId: datos.faseId,
      descripcion: `${datos.titulo}: ${datos.descripcion}`,
      porcentajeAvance: datos.porcentajeAvance,
      fechaReporte: new Date(),
      multimedia: [] // Aquí se podrían procesar las imágenes después
    };

    this.proyectoService.crearAvance(this.proyecto.id, payload).subscribe({
      next: () => {
        this.cargarAvances();
        this.cerrarNuevaEntrada();
      },
      error: (err) => console.error('Error guardando avance', err)
    });
  }

  /** Portada del avance, descartando videos y sin depender de imagenes remotas. */
  portada(multimedia: any[] | undefined): string {
    return imagenPrincipal(multimedia, '/images/hero_constructor.webp');
  }

  getProgresoGlobal(): number {
    if (!this.fases || this.fases.length === 0) return 0;
    const total = this.fases.reduce((acc, f) => acc + (f.progreso || 0), 0);
    return Math.round(total / this.fases.length);
  }

  getFaseActual(): string {
    if (!this.fases || this.fases.length === 0) return 'Sin Fases';
    const actual = this.fases.find(f => f.estado === 'en_progreso');
    return actual ? actual.nombre : 'Planeación';
  }
}
