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

  toggleMenuCuenta() {
    this.mostrarMenuCuenta = !this.mostrarMenuCuenta;
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  proyectos = [
    {
      nombre: 'Lumina Tower',
      fase: 'Phase 4: Exterior Cladding',
      completado: 74,
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ujXJo5v3OJV0LIKdtzitC5ADeP1oTeA7K42ESed9yL4rCx5-vdO3EE054F7JAF5k4KKumPdf8qtwSR-TzqouxJvLFh_UHkX7arZGjTaqPnTWv0Nx5xme9mXJmY_wYX-svkDbmxTHbH7_qTXSGOP4ak0EbgcwwnabjhEDkH-gGvEww_Erlk_EVZBNP4AZQgWilvRlwHS9QiGxvEMk5ORe8LlZJWJUSKQqFIvHylgYW7Q3tDaKkPpcQfMhkEiwgA4QWGAzXYGA-XtrWg'
    },
    {
      nombre: 'Zenith Plaza',
      fase: 'Phase 1: Foundation',
      completado: 22,
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0uh6WrgKwvsscGsF52PftdJviLiPAfDrphwgbQxCgdnJ_ZcdXkvMgle2-ZbyXkT1TGEw-iQIuhgFuM1HDWl25aR3Dsi1wVogFWAiu-EW1M5uB9eZnM4vdTD50RVhYdkcCXv22wx3GGWZSAjk8kgOATdwK4-ilaYxb2l2I_yLV5zTa9IO5BQnj51LnW-RV1ZDMfF9Xj2HaPCxQnEgkCd-DPW7xrG4ToKKuu9AsD8FKeArHIsuAfuvqf4In_ZA76dKy8qzSNK_Hr-VC-0'
    }
  ];

  oportunidades = [
    {
      nombre: 'Plot Alpha-9',
      ubicacion: 'North Financial District',
      yield: '12.4%',
      zoning: 'Mixed-Use Commercial',
      area: '4.2 Ha',
      tag: 'HIGH YIELD',
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0uhbmZSNjgdd2H1OVTXQaCy1bYfOkwx5Ay7cCcO_nKuCyJI_alV4SKUyZ9exPsoFycu_d_G8BQjQ9P25400qh8Jp5Ecxf45NdZ9LwzrK4sfhibPg25kp7BxQOue0VN_ZysqCD7n7DQaPkVi1OjyGDb-yeWeNIKGBJI4mDlWecTufLLsxuTHzT0VEyH05Dgt_1GXRGob6Qoytf_xszoG8M6wDz_Qdna1cP8SKp0wIiHY2hHwWONGtB2D2tkrBgIjMnafAAfDlGUsXgQc'
    },
    {
      nombre: 'Plot Gamma-2',
      ubicacion: 'Industrial Waterfront',
      yield: '9.8%',
      zoning: 'Industrial Conversion',
      area: '6.8 Ha',
      tag: 'PRE-VETTED',
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ujcggHDS4yNZlQwmoWDFLVkF7p9GJ6OSaMI6uLODKAHVzmSTWrf9VrppQYAzW5o2fkZKuCwMEYiQq4WjNGJIMi_4dmC_oumsm7dRr9bZAf_0shXddC07Uptg1r3_ONmQSO8Y7MReK3K1sLhz42HoMZVVX8go8XU5kphdEQxFJ7ylYNCyz7OEU9_g4Mw5pzZWCViyaedg5LHJQTSJWqpVmTCULVrpTXL8PLw9zyfRMOB0xqmE8ANq9WZO7xDhEn8N7YeHWC2426t71E'
    }
  ];
}
