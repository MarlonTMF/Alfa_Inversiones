import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PublicNavbar } from '../layout/public-navbar/public-navbar';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Login, PublicNavbar],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    
    public mostrarLogin: boolean = false;
    public activeTab: 'inversor' | 'constructor' | 'propiedad' = 'inversor';
    public usuariosDemo = [
        { rol: 'admin', nombre: 'Administrador', descripcion: 'Panel completo de operación', color: '#60a5fa' },
        { rol: 'inversor', nombre: 'Inversor', descripcion: 'Seguimiento del portafolio', color: '#34d399' },
        { rol: 'constructor', nombre: 'Constructor', descripcion: 'Gestión de proyectos y avances', color: '#fbbf24' },
        { rol: 'propietario', nombre: 'Propietario', descripcion: 'Registro y validación de terrenos', color: '#f472b6' },
    ];

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

    abrirVentanaDemo(rol: string): void {
        if (typeof window === 'undefined') {
            return;
        }

        const token = this.authService.generarTokenDemo(rol);
        const url = `${window.location.origin}${window.location.pathname}?demoUser=${rol}&demoToken=${token}`;
        window.open(url, '_blank', 'noopener,noreferrer,width=1500,height=1000');
    }

    private redireccionarSegunRol(usuario: any): void {
        this.router.navigateByUrl(this.authService.rutaInicioPorRol(usuario?.rol));
    }

    setTab(tab: 'inversor' | 'constructor' | 'propiedad') {
        this.activeTab = tab;
    }
}