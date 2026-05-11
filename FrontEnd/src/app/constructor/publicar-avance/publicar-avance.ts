import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-publicar-avance',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publicar-avance.html',
  styleUrl: './publicar-avance.css'
})
export class ConstructorPublicarAvance {
  mostrarMenuCuenta: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

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
