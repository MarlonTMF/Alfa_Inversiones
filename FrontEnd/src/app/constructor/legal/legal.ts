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
      auditorLogo: 'https://lh3.googleusercontent.com/aida/ADBb0uhAQEFTsUyt8n6x0YOWZmra4Uyp7EjIQXVbbCHJ9YFi3LTdZdz7A5Kboqj6vck7y6261DdRxSMHNkSx_4HIIvFN14UR6OSZMqmlB_B4c4Mb4-2c1YM13lnsxMCYHP_dyjWHdc3iNJGZCsiV-JeOI4BBATCK4eRYWFxKUhyS2s2HbJqappiXwDAWgRcK1rycELjZGeIP-_N_lTBF_BGXUHHEsuxXM7rLsagfB4ZUjacXbqokFrm6nEx8lftPeFwzVQi_mUKrPSd3rQ',
      fecha: '2023-10-24 14:22:01 UTC',
      blockchainId: '0x84f2...a90e'
    },
    {
      nombre: 'Informe de Integridad Estructural V2',
      categoria: 'Construcción',
      auditor: 'Baker McKenzie Partners',
      auditorLogo: 'https://lh3.googleusercontent.com/aida/ADBb0uiRce-0_6FmFrZWz1CwKtmExOLrjSwLDSy3fEGdMQUUJZQDJuFdoWE_ZDklzOaUsEDUtNxEvM4rzxbGApGXQ6c5E8bOn_dM8KwJbP857WjIEbxiWVMx9u8ZewnGLBKxur0F7FyHKXKjVW_CRJ-FnurgGhorE7DTRuzXkFGjKeOHt3j4trTgGVAXB1ntakPz5J7yR_5oJF-QliU9ohxCvCOu0MjcX4jNYXsIEs-mFlQG0K6BF6aDVy_On1Ji65es_8A0Fk8Hq6CUFA',
      fecha: '2023-10-22 09:15:45 UTC',
      blockchainId: '0x31c8...e7fb'
    },
    {
      nombre: 'Evaluación de Impacto Ambiental',
      categoria: 'Regulatorio',
      auditor: 'Deloitte Legal S.L.',
      auditorLogo: 'https://lh3.googleusercontent.com/aida/ADBb0uhAQEFTsUyt8n6x0YOWZmra4Uyp7EjIQXVbbCHJ9YFi3LTdZdz7A5Kboqj6vck7y6261DdRxSMHNkSx_4HIIvFN14UR6OSZMqmlB_B4c4Mb4-2c1YM13lnsxMCYHP_dyjWHdc3iNJGZCsiV-JeOI4BBATCK4eRYWFxKUhyS2s2HbJqappiXwDAWgRcK1rycELjZGeIP-_N_lTBF_BGXUHHEsuxXM7rLsagfB4ZUjacXbqokFrm6nEx8lftPeFwzVQi_mUKrPSd3rQ',
      fecha: '2023-10-18 11:30:12 UTC',
      blockchainId: '0x9a44...b2cc'
    }
  ];
}
