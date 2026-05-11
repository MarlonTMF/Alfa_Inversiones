import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-inversor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class InversorDashboard {
  authService = inject(AuthService);
  usuario = this.authService.usuarioActual;
  private router = inject(Router);

  irAlMapa(): void {
    this.router.navigate(['/mapa']);
  }

  stats = {
    valorNeto: '1,482,900',
    crecimiento: '+12.4%',
    proximoDividendo: '3,420.00',
    propiedadDividendo: 'Cerrito 1144',
    fechaDividendo: '15 de Mayo'
  };

  actividad = [
    { 
      titulo: 'Dividendo Recibido - Edificio Olivos', 
      desc: 'Acreditado a tu billetera', 
      monto: '+$850.00', 
      fecha: 'Hoy, 10:45 AM',
      tipo: 'pago',
      positivo: true
    },
    { 
      titulo: 'Documentación Actualizada', 
      desc: 'Reporte trimestral disponible', 
      monto: null, 
      fecha: 'Ayer',
      tipo: 'doc',
      positivo: false
    },
    { 
      titulo: 'Inversión Confirmada', 
      desc: 'Fracciones adquiridas en \'Residencias del Sol\'', 
      monto: '-$15,000.00', 
      fecha: '4 May 2024',
      tipo: 'inv',
      positivo: false
    }
  ];
}
