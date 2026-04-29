import { Component, inject, OnInit } from '@angular/core';
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

  cargando = false;
  error: string | null = null;
  proyectos: any[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = null;

    this.proyectoService.listarProyectos().subscribe({
      next: (data) => {
        this.proyectos = data ?? [];
        this.cargando = false;
      },
      error: (err: unknown) => {
        const id = this.authService.usuarioActual()?.id;

        if (!id) {
          this.error =
            'Falta `id` de admin en sesión. Cierra sesión e inicia sesión de nuevo.';
          this.cargando = false;
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
            'No se pudo cargar proyectos. Verifica: 1) BackEnd arriba en http://localhost:3000 2) tabla proyectos creada 3) CORS/Network.';
        }
        this.cargando = false;
      },
    });
  }
}
