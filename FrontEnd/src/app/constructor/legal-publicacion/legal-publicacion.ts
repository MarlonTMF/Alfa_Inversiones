import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-legal-publicacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal-publicacion.html',
  styleUrl: './legal-publicacion.css'
})
export class ConstructorLegalPublicacion {
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
  proyecto = {
    nombre: 'Condominio Equipetrol Norte',
    id: 'ASSET-4820',
    ubicacion: 'Equipetrol Norte, Santa Cruz',
    valoracion: 42.8,
    riesgo: 'Bajo',
    imagen: '/images/proyecto_calacoto.webp'
  };

  historial = [
    { titulo: 'Título de Propiedad Validado', tiempo: 'Hace 2 horas', autor: 'Sistema Central' },
    { titulo: 'Edición de Metadatos', tiempo: 'Ayer', autor: 'Legal Admin' }
  ];

  categorias = [
    'Permiso de Construcción',
    'Licencia Ambiental',
    'Título de Propiedad',
    'Certificado de Tradición',
    'Poder Representativo'
  ];

  estadoActual: string = 'Verificado';

  cambiarEstado(nuevoEstado: string) {
    this.estadoActual = nuevoEstado;
  }
}
