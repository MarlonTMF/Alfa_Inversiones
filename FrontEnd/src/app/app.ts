import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AmenidadesService } from './services/amenidades';
import { Login } from './auth/login/login';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, Login],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App implements OnInit {
    protected readonly title = signal('plataforma-inmobiliaria');
    public amenidadesService = inject(AmenidadesService);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    
    public sidebarAbierto: boolean = false;
    public mostrarLogin: boolean = false;
    public usuarioActual: any = null;
    public mostrarMenuPerfil: boolean = false;
    public rutaActual: string = '';

    constructor() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.rutaActual = event.urlAfterRedirects;
            }
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
        this.sidebarAbierto = !this.sidebarAbierto;
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
}