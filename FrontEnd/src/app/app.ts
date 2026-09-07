import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Navbar } from './layout/navbar/navbar';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, Navbar],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    public sidebarAbierto: boolean = false;
    public esAdminRoute: boolean = false;

    constructor(private router: Router) {
        // Evaluamos ya la URL actual: si esperamos al primer NavigationEnd, la
        // navbar global alcanza a pintarse sobre pantallas que traen la suya
        // propia (landing, paneles) y se ven dos cabeceras superpuestas.
        this.esAdminRoute = App.traeNavbarPropia(this.router.url);

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.esAdminRoute = App.traeNavbarPropia(event.urlAfterRedirects);
        });
    }

    /** Rutas que ya dibujan su propia cabecera y no deben recibir la global. */
    private static traeNavbarPropia(url: string): boolean {
        const ruta = (url || '').split('?')[0];
        return ruta === '' ||
               ruta === '/' ||
               ruta.startsWith('/admin') ||
               ruta.startsWith('/constructor') ||
               ruta.startsWith('/inversor') ||
               ruta.startsWith('/explorar') ||
               ruta.startsWith('/terreno-info') ||
               ruta.startsWith('/ayuda');
    }

    toggleSidebar(): void {
        this.sidebarAbierto = !this.sidebarAbierto;
    }
}