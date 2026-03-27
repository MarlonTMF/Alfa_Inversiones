import { Component, inject, OnInit, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Login } from '../../auth/login/login';
import { ExploradorService } from '../../services/explorador';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, Login],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    public readonly exploradorService = inject(ExploradorService);

    @Output() toggleSidebarEvent = new EventEmitter<void>();

    public mostrarLogin: boolean = false;
    public usuarioActual: any = null;
    public mostrarMenuPerfil: boolean = false;
    public esRutaMapa: boolean = true;
    public mostrarExplorador: boolean = false;

    constructor() {
        this.esRutaMapa = this.router.url === '/' || this.router.url.includes('/mapa');
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.esRutaMapa = event.urlAfterRedirects.includes('/mapa');
        });
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const usuarioGuardado = localStorage.getItem('usuario365');
            if (usuarioGuardado) {
                this.usuarioActual = JSON.parse(usuarioGuardado);
            }
        }
    }

    toggleSidebar(): void {
        this.toggleSidebarEvent.emit();
    }

    procesarLogin(usuario: any): void {
        this.usuarioActual = usuario;
        this.mostrarLogin = false;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('usuario365', JSON.stringify(usuario));
        }
    }

    cerrarSesion(): void {
        this.usuarioActual = null;
        this.mostrarMenuPerfil = false;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('usuario365');
        }
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