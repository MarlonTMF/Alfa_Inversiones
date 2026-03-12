import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AmenidadesService } from './services/amenidades';
import { Login } from './auth/login/login';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, Login],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title = signal('plataforma-inmobiliaria');
    public amenidadesService = inject(AmenidadesService);
    
    public sidebarAbierto: boolean = false;
    public mostrarLogin: boolean = false;
    public usuarioActual: any = null;
    public mostrarMenuPerfil: boolean = false;

    toggleSidebar(): void {
        this.sidebarAbierto = !this.sidebarAbierto;
    }

    procesarLogin(usuario: any): void {
        this.usuarioActual = usuario;
        this.mostrarLogin = false;
    }

    cerrarSesion(): void {
        this.usuarioActual = null;
        this.mostrarMenuPerfil = false;
    }

    toggleMenuPerfil(): void {
        this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
    }
}