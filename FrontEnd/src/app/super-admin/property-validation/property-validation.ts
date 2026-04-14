import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-validation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './property-validation.html',
  styleUrl: './property-validation.css'
})
export class PropertyValidation {
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
