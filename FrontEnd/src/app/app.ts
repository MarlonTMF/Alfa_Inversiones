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
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            const url = event.urlAfterRedirects;
            this.esAdminRoute = url.includes('/admin') || 
                                url.includes('/constructor') || 
                                url.includes('/inversor');
        });
    }

    toggleSidebar(): void {
        this.sidebarAbierto = !this.sidebarAbierto;
    }
}