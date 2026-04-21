import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.html',
    styleUrl: './admin-layout.css'
})
export class AdminLayout {
    public authService = inject(AuthService);
    private router = inject(Router);

    public mostrarNotificaciones: boolean = false;
    public tieneNuevasNotificaciones: boolean = true;

    salirAlMapa(): void {
        this.router.navigate(['/mapa']);
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
}