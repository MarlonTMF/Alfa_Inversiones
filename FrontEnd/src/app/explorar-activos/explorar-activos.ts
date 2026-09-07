import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';
import { Mapa } from '../mapa/mapa';
import { ExploradorService } from '../services/explorador';
import { AmenidadesService } from '../services/amenidades';
import { PublicNavbar } from '../layout/public-navbar/public-navbar';

@Component({
  selector: 'app-explorar-activos',
  standalone: true,
  imports: [CommonModule, Login, Mapa, PublicNavbar],
  templateUrl: './explorar-activos.html',
  styleUrl: './explorar-activos.css'
})
export class ExplorarActivos implements OnInit {
    public authService = inject(AuthService);
    public exploradorService = inject(ExploradorService);
    public amenidadesService = inject(AmenidadesService);
    private router = inject(Router);
    
    public mostrarLogin: boolean = false;

    ngOnInit(): void {
        // Asegurarse de que el servicio esté limpio al iniciar si es necesario
    }

    procesarLogin(usuario: any): void {
        this.authService.login(usuario);
        this.mostrarLogin = false;
        this.redireccionarSegunRol(usuario);
    }

    private redireccionarSegunRol(usuario: any): void {
        const rol = (usuario.rol || '').toLowerCase();
        if (rol === 'inversor' || rol === 'inversionista') {
            this.router.navigate(['/mapa']);
        } else if (rol === 'constructor') {
            this.router.navigate(['/constructor']);
        } else if (rol === 'admin' || rol === 'super-admin') {
            this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/mapa']);
        }
    }

    onSearch(event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        this.exploradorService.buscarPorTexto(valor);
    }

    cambiarDepartamento(event: any): void {
        this.exploradorService.cambiarDepartamento(event.target.value);
    }

    seleccionarActivo(terreno: any): void {
        this.exploradorService.seleccionarTerreno(terreno);
    }
}
