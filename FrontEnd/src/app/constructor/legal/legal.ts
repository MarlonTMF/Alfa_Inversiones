import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-constructor-legal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class ConstructorLegal {
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
  documentos = [
    {
      nombre: 'Certificado de Zonificación - Parcela 042',
      categoria: 'Activo de Tierra',
      auditor: 'Deloitte Legal S.L.',
      fecha: '2023-10-24 14:22:01 UTC',
      blockchainId: '0x84f2...a90e'
    },
    {
      nombre: 'Informe de Integridad Estructural V2',
      categoria: 'Construcción',
      auditor: 'Baker McKenzie Partners',
      fecha: '2023-10-22 09:15:45 UTC',
      blockchainId: '0x31c8...e7fb'
    },
    {
      nombre: 'Evaluación de Impacto Ambiental',
      categoria: 'Regulatorio',
      auditor: 'Deloitte Legal S.L.',
      fecha: '2023-10-18 11:30:12 UTC',
      blockchainId: '0x9a44...b2cc'
    }
  ];
}
