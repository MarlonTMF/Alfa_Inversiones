import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-proyectos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})
export class ConstructorProyectos {
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
  proyectos = [
    {
      id: 1,
      nombre: 'Torres del Prado',
      ubicacion: 'Santa Cruz, Bolivia',
      completado: 78,
      fase: 'Fase 04: Revestimiento Exterior',
      personal: 142,
      seguridad: '9.8 Perfecto',
      imagen: '/images/proyecto_torres_prado.webp'
    },
    {
      id: 2,
      nombre: 'Condominio Equipetrol Norte',
      ubicacion: 'Santa Cruz, Bolivia',
      completado: 32,
      fase: 'Fase 02: Montaje de Acero',
      personal: 285,
      seguridad: 'Retraso por Clima',
      imagen: '/images/proyecto_equipetrol.webp'
    },
    {
      id: 3,
      nombre: 'Complejo Calacoto Business',
      ubicacion: 'La Paz, Bolivia',
      completado: 94,
      fase: 'Fase 06: Preparación para Entrega',
      personal: 58,
      seguridad: 'Esperando Firma Final',
      imagen: '/images/proyecto_calacoto.webp'
    }
  ];

  logs = [
    { sitio: 'Obra Torres del Prado', tiempo: 'hace 2m', mensaje: 'Vaciado de losa nivel 14. Resistencia del concreto verificada en 45MPa. Cero incidentes.', tipo: 'success' },
    { sitio: 'Obra Equipetrol', tiempo: 'hace 14m', mensaje: 'Vientos exceden 45km/h. Operación de grúa torre 3 suspendida hasta nuevo aviso.', tipo: 'warning' },
    { sitio: 'Notificación HQ', tiempo: 'hace 1h', mensaje: 'Documentación técnica para "Complejo Calacoto" aprobada por el consejo local.', tipo: 'info' }
  ];
}
