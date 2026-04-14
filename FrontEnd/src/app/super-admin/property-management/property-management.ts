import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './property-management.html',
  styleUrl: './property-management.css'
})
export class PropertyManagement {
  public authService = inject(AuthService);
  private router = inject(Router);
  
  public mostrarMenuPerfil = false;

  toggleMenuPerfil(): void {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
