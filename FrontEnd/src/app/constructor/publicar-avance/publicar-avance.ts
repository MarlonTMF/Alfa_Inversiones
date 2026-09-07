import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-publicar-avance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './publicar-avance.html',
  styleUrl: './publicar-avance.css'
})
export class ConstructorPublicarAvance {
  mostrarMenuCuenta: boolean = false;
  descripcion: string = '';
  publicado: boolean = false;

  /** URL local (blob:) de la imagen principal recien elegida, si el usuario reemplazo el media. */
  mediaPrincipalUrl: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * No hay un backend conectado en esta vista de demostracion, asi que
   * "publicar" no envia nada a un servidor: da la confirmacion visible que
   * antes el boton, sin ningun (click), nunca daba. Sin zone.js (Angular
   * zoneless) un setTimeout no dispara deteccion de cambios por si solo,
   * asi que la confirmacion se resuelve en el mismo ciclo del clic.
   */
  publicarActualizacion(): void {
    if (!this.descripcion.trim()) {
      return;
    }
    this.publicado = true;
    this.descripcion = '';
  }

  /** Reemplaza la imagen principal por la que el usuario elija de su equipo. */
  reemplazarMedia(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) {
      return;
    }
    if (this.mediaPrincipalUrl) {
      URL.revokeObjectURL(this.mediaPrincipalUrl);
    }
    this.mediaPrincipalUrl = URL.createObjectURL(archivo);
    input.value = '';
  }

  toggleMenuCuenta() {
    this.mostrarMenuCuenta = !this.mostrarMenuCuenta;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  hitos = [
    { id: 'M-12.01', titulo: 'Vaciado de Cimentación Estructural', progreso: 85, estado: 'active' },
    { id: 'M-12.02', titulo: 'Instalación de Líneas de Servicios', progreso: 0, estado: 'pending' },
    { id: 'M-12.03', titulo: 'Despliegue de Andamiaje Externo', progreso: 0, estado: 'scheduled', fecha: 'Oct 15' }
  ];

  notificarInversores: boolean = true;

  toggleNotificacion() {
    this.notificarInversores = !this.notificarInversores;
  }
}
