import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AmenidadesService } from './services/amenidades';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    protected readonly title = signal('plataforma-inmobiliaria');
    public amenidadesService = inject(AmenidadesService);
    public sidebarAbierto: boolean = false;

    toggleSidebar(): void {
        this.sidebarAbierto = !this.sidebarAbierto;
    }
}