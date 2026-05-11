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
    nombre: 'Neo-Lumina Research Hub',
    id: 'NL-ZH-2024-01',
    roi: 18.4,
    progreso: 78.2,
    capital: 42.8,
    objetivo: 45.0,
    entidad: 'Lumina Swiss AG',
    arquitecto: 'M. Sterling',
    fase: '04 de 06'
  };

  actualizacion = {
    titulo: 'Instalación de Sistema de Fachada',
    fecha: '24 Oct, 2024',
    descripcion: 'El panelado de vidrio exterior ha alcanzado el nivel 12. Integridad estructural confirmada por el ingeniero jefe.',
    personal: 142,
    estado: 'Verificado (L12)',
    cronograma: 'En Tiempo',
    imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ujAoHwpKG-YjOt5Un9ooFoeTMupUOg672VgZjDKD62okkHq8DHXGivNExBvJUk_hlLE1lFNfBlsBmDnwgxhncPeRSUg1U_-Ksu6x7nhKcXL4zLKQ3g00ttb4CAx26yWbn945pFnCkza2BbIgiQqsJMaxv_vStEQ5098YI2QFuqv6zPVRem4KRTPr_D25ZZjBwXhKLaVW9KMNE7DOc8O1kMv_FV0eqtyT9Hy1cb38QzH0_mMzedjXcUMHA7IQh_3sn4I9fdRVnDI6CI'
  };
}
