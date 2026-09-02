import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css'
})
export class ConstructorProyectoDetalle {
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
    nombre: 'Torres del Prado',
    id: 'TP-SCZ-2024-01',
    roi: 18.4,
    progreso: 78.2,
    capital: 42.8,
    objetivo: 45.0,
    entidad: 'Constructora Link S.R.L.',
    arquitecto: 'Arq. Carlos Méndez',
    fase: '04 de 06'
  };

  actualizacion = {
    titulo: 'Instalación de Sistema de Fachada',
    fecha: '24 Oct, 2024',
    descripcion: 'El panelado de vidrio exterior ha alcanzado el nivel 12. Integridad estructural confirmada por el ingeniero jefe.',
    personal: 142,
    estado: 'Verificado (L12)',
    cronograma: 'En Tiempo',
    imagen: '/images/proyecto_torres_prado.webp'
  };
}
