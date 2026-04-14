import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-constructor-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './constructor-management.html',
  styleUrl: './constructor-management.css'
})
export class ConstructorManagement {
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
