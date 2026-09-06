import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  public authService = inject(AuthService);
  private router = inject(Router);

  public mostrarNotificaciones: boolean = false;
  public tieneNuevasNotificaciones: boolean = true;
  public mostrarMenuCuenta: boolean = false;
  /** En pantallas <=1024px el sidebar es un cajon deslizante. */
  public sidebarAbierto: boolean = false;

  constructor() {
    // Al navegar, el cajon se cierra: en movil tapa toda la pantalla y
    // dejarlo abierto oculta la pagina a la que se acaba de entrar.
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.cerrarSidebar());
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.cerrarSidebar();
    this.cerrarOverlays();
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }

  salirAlMapa(): void {
    this.router.navigate(['/mapa']);
  }

  toggleMenuCuenta(): void {
    this.mostrarMenuCuenta = !this.mostrarMenuCuenta;
  }

  cerrarMenuCuenta(): void {
    this.mostrarMenuCuenta = false;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.cerrarMenuCuenta();
    this.cerrarSidebar();
    this.router.navigate(['/']);
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
    if (this.mostrarNotificaciones) {
      this.tieneNuevasNotificaciones = false;
    }
  }

  cerrarNotificaciones(): void {
    this.mostrarNotificaciones = false;
  }

  cerrarOverlays(): void {
    this.cerrarNotificaciones();
    this.cerrarMenuCuenta();
  }
}
