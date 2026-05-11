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
      nombre: 'Neo-Lumina Research Hub',
      ubicacion: 'Zurich, Suiza',
      completado: 78,
      fase: 'Fase 04: Revestimiento Exterior',
      personal: 142,
      seguridad: '9.8 Perfecto',
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ujAoHwpKG-YjOt5Un9ooFoeTMupUOg672VgZjDKD62okkHq8DHXGivNExBvJUk_hlLE1lFNfBlsBmDnwgxhncPeRSUg1U_-Ksu6x7nhKcXL4zLKQ3g00ttb4CAx26yWbn945pFnCkza2BbIgiQqsJMaxv_vStEQ5098YI2QFuqv6zPVRem4KRTPr_D25ZZjBwXhKLaVW9KMNE7DOc8O1kMv_FV0eqtyT9Hy1cb38QzH0_mMzedjXcUMHA7IQh_3sn4I9fdRVnDI6CI'
    },
    {
      id: 2,
      nombre: 'Titan Data Complex',
      ubicacion: 'Ashburn, Virginia',
      completado: 32,
      fase: 'Fase 02: Montaje de Acero',
      personal: 285,
      seguridad: 'Retraso por Clima',
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0uhbmZSNjgdd2H1OVTXQaCy1bYfOkwx5Ay7cCcO_nKuCyJI_alV4SKUyZ9exPsoFycu_d_G8BQjQ9P25400qh8Jp5Ecxf45NdZ9LwzrK4sfhibPg25kp7BxQOue0VN_ZysqCD7n7DQaPkVi1OjyGDb-yeWeNIKGBJI4mDlWecTufLLsxuTHzT0VEyH05Dgt_1GXRGob6Qoytf_xszoG8M6wDz_Qdna1cP8SKp0wIiHY2hHwWONGtB2D2tkrBgIjMnafAAfDlGUsXgQc'
    },
    {
      id: 3,
      nombre: 'Apex Global Logistics',
      ubicacion: 'Dubai, EAU',
      completado: 94,
      fase: 'Fase 06: Preparación para Entrega',
      personal: 58,
      seguridad: 'Esperando Firma Final',
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ui97Z3UblNdgwwVzPU7tgT7HKa9AMJ2qLG54URPqwlJpTzLq7D5YBLoXpwUA94S9yIt2vwMtzOqPcwa0p9S6MJ_H2wmJSY0P8Jsct5Qt6utqXlHkJoSq4jqkb4LDYQYc8-SlF0x7D3BVElCBQ_3Y1E-JWz4rmquK_CCcC8YSPYU235d9waZSemWpiFPTHTqPRJeLYxd9ogbLv3IdKeYIqK2paxFUAWpwBFH1Hvf5L4s7562bu3axP79F2SDCoPQqv3dH0WGaM-GWGY'
    }
  ];

  logs = [
    { sitio: 'Sitio Alpha-9', tiempo: 'hace 2m', mensaje: 'Vaciado de losa nivel 14. Resistencia del concreto verificada en 45MPa. Cero incidentes.', tipo: 'success' },
    { sitio: 'Sitio Gamma-2', tiempo: 'hace 14m', mensaje: 'Vientos exceden 45km/h. Operación de grúa torre 3 suspendida hasta nuevo aviso.', tipo: 'warning' },
    { sitio: 'Notificación HQ', tiempo: 'hace 1h', mensaje: 'Documentación técnica para "The Axis Complex" aprobada por el consejo local.', tipo: 'info' }
  ];
}
