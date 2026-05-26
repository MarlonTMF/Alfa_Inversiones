import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Login],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    
    public mostrarLogin: boolean = false;
    public activeTab: 'inversor' | 'constructor' | 'propiedad' = 'inversor';

    ngOnInit(): void {
        const usuario = this.authService.usuarioActual();
        if (usuario) {
            this.redireccionarSegunRol(usuario);
        }
    }

    procesarLogin(usuario: any): void {
        this.authService.login(usuario);
        this.mostrarLogin = false;
        this.redireccionarSegunRol(usuario);
    }

    private redireccionarSegunRol(usuario: any): void {
        const rol = (usuario.rol || '').toLowerCase();
        if (rol === 'inversor') {
            this.router.navigate(['/inversor']);
        } else if (rol === 'constructor') {
            this.router.navigate(['/constructor']);
        } else if (rol === 'admin' || rol === 'super-admin') {
            this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/mapa']);
        }
    }

    setTab(tab: 'inversor' | 'constructor' | 'propiedad') {
        this.activeTab = tab;
    }
}