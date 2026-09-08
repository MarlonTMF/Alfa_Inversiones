import { Component, inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Login } from '../../auth/login/login';
import { ExploradorService } from '../../services/explorador';
import { AuthService } from '../../auth/services/auth';
import { AmenidadesService } from '../../services/amenidades';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, Login],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    
    public readonly exploradorService = inject(ExploradorService);
    public readonly authService = inject(AuthService);
    public readonly amenidadesService = inject(AmenidadesService);

    @Output() toggleSidebarEvent = new EventEmitter<void>();

    public mostrarLogin: boolean = false;
    public mostrarMenuPerfil: boolean = false;
    public esRutaMapa: boolean = false;
    public mostrarExplorador: boolean = false;

    constructor() {
        this.esRutaMapa = this.router.url.includes('/mapa');

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.esRutaMapa = event.urlAfterRedirects.includes('/mapa');
        });
    }

    irAlInicio(): void {
        if (this.authService.estaAutenticado()) {
            this.router.navigateByUrl(this.authService.rutaInicioUsuarioActual());
        } else {
            this.router.navigate(['/']);
        }
    }

    toggleSidebar(): void {
        this.toggleSidebarEvent.emit();
    }

    procesarLogin({ usuario, token }: { usuario: any; token?: string }): void {
        this.authService.login(usuario, token);
        this.mostrarLogin = false;
        this.router.navigateByUrl(this.authService.rutaInicioPorRol(usuario?.rol));
    }


    cerrarSesion(): void {
        this.authService.logout();
        this.mostrarMenuPerfil = false;
        this.router.navigate(['/']);
    }

    toggleMenuPerfil(): void {
        this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
    }

    abrirExplorador(): void {
        this.mostrarExplorador = true;
    }

    cerrarExplorador(): void {
        this.mostrarExplorador = false;
    }

    toggleExplorador(event: Event): void {
        event.stopPropagation();
        this.mostrarExplorador = !this.mostrarExplorador;
    }

    onSearch(event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        this.exploradorService.buscarPorTexto(valor);
    }

    seleccionarActivo(terreno: any): void {
        this.exploradorService.seleccionarTerreno(terreno);
        this.cerrarExplorador();
        if (!this.esRutaMapa) {
            this.router.navigate(['/mapa']);
        }
    }
    
    cambiarDepartamento(event: any): void {
        this.exploradorService.cambiarDepartamento(event.target.value);
    }
}