import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-registro-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro-proyecto.html',
  styleUrl: './registro-proyecto.css',
})
export class RegistroProyecto {
  private readonly proyectoService = inject(ProyectoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  cargando = false;
  error: string | null = null;
  exito: string | null = null;

  form = {
    nombre: '',
    codigo: '',
    descripcion: '',
    estado: 'planificacion',
    tipoProyecto: 'residencial',
  };

  crear(): void {
    this.error = null;
    this.exito = null;

    const adminId = this.authService.usuarioActual()?.id;
    if (!adminId) {
      this.error = 'Falta `id` del admin en sesión. Cierra sesión e inicia sesión de nuevo.';
      return;
    }

    if (!this.form.nombre?.trim()) {
      this.error = 'El nombre del proyecto es obligatorio.';
      return;
    }

    this.cargando = true;
    this.proyectoService
      .crearProyecto({
        nombre: this.form.nombre,
        codigo: this.form.codigo || undefined,
        descripcion: this.form.descripcion || undefined,
        estado: this.form.estado,
        tipoProyecto: this.form.tipoProyecto,
      })
      .subscribe({
        next: () => {
          this.cargando = false;
          this.exito = 'Proyecto creado.';
          setTimeout(() => this.router.navigate(['/admin/proyectos']), 500);
        },
        error: () => {
          this.cargando = false;
          this.error = 'No se pudo crear el proyecto (verifica BackEnd y header x-admin-id).';
        },
      });
  }
}
