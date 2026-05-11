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
    nombre: 'Skyline Heights Phase II',
    id: 'ASSET-4820',
    ubicacion: 'Silicon Valley, CA',
    valoracion: 42.8,
    riesgo: 'Bajo',
    imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ui97Z3UblNdgwwVzPU7tgT7HKa9AMJ2qLG54URPqwlJpTzLq7D5YBLoXpwUA94S9yIt2vwMtzOqPcwa0p9S6MJ_H2wmJSY0P8Jsct5Qt6utqXlHkJoSq4jqkb4LDYQYc8-SlF0x7D3BVElCBQ_3Y1E-JWz4rmquK_CCcC8YSPYU235d9waZSemWpiFPTHTqPRJeLYxd9ogbLv3IdKeYIqK2paxFUAWpwBFH1Hvf5L4s7562bu3axP79F2SDCoPQqv3dH0WGaM-GWGY'
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
