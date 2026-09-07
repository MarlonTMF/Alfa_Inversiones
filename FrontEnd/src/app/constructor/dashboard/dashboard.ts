import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class ConstructorDashboard {
  mostrarMenuCuenta: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /** Nombre de pila para el saludo, o la razon social entera si es una empresa. */
  nombreSaludo(): string {
    const nombre: string = this.authService.usuarioActual()?.nombre || '';
    if (!nombre) return 'Constructora';
    return /S\.?A\.?|S\.?R\.?L\.?|LTDA|&/i.test(nombre) ? nombre : nombre.split(' ')[0];
  }

  toggleMenuCuenta() {
    this.mostrarMenuCuenta = !this.mostrarMenuCuenta;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  proyectos = [
    {
      nombre: 'Torres del Prado',
      fase: 'Fase 04: Revestimiento Exterior',
      completado: 74,
      imagen: '/images/proyecto_torres_prado.webp'
    },
    {
      nombre: 'Condominio Equipetrol Norte',
      fase: 'Fase 01: Excavación y Cimentación',
      completado: 22,
      imagen: '/images/proyecto_equipetrol.webp'
    }
  ];

  oportunidades = [
    {
      nombre: 'Lote Urubó Sur',
      ubicacion: 'Zona Norte, Santa Cruz',
      yield: '12.4%',
      zoning: 'Uso Mixto Comercial',
      area: '12.4 Ha',
      tag: 'ALTO RENDIMIENTO',
      imagen: '/images/terreno_urubo.webp'
    },
    {
      nombre: 'Parcela Industrial Warnes',
      ubicacion: 'Parque Industrial, Warnes',
      yield: '9.8%',
      zoning: 'Conversión Industrial',
      area: '6.8 Ha',
      tag: 'PRE-EVALUADO',
      imagen: '/images/terreno_warnes.webp'
    }
  ];
}
