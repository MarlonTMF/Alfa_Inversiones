import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth';
import { Login } from '../../auth/login/login';

/**
 * Cabecera de las paginas publicas (landing y sus fichas por perfil).
 *
 * Antes este bloque estaba copiado en cuatro plantillas distintas: las tres
 * fichas mostraban la sesion abierta y la landing principal seguia ofreciendo
 * "Iniciar Sesion" aunque el usuario ya hubiera entrado. Ademas ninguna traia
 * menu movil, asi que por debajo de 768px la navegacion desaparecia entera.
 */
@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, Login],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.css',
})
export class PublicNavbar {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public mostrarLogin = false;
  public menuAbierto = false;

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.cerrarMenu());
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.cerrarMenu();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  abrirLogin(): void {
    this.cerrarMenu();
    this.mostrarLogin = true;
  }

  procesarLogin(usuario: any): void {
    this.authService.login(usuario);
    this.mostrarLogin = false;
    this.router.navigateByUrl(this.authService.rutaInicioPorRol(usuario?.rol));
  }

  irAMiPanel(): void {
    this.cerrarMenu();
    this.router.navigateByUrl(this.authService.rutaInicioUsuarioActual());
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.cerrarMenu();
    this.router.navigate(['/']);
  }
}
