import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, Login],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    
    public mostrarLogin: boolean = false;

    ngOnInit(): void {
        if (this.authService.estaAutenticado()) {
            this.router.navigate(['/mapa']);
        }
    }

    procesarLogin(usuario: any): void {
        this.authService.login(usuario);
        this.mostrarLogin = false;
        this.router.navigate(['/mapa']);
    }
}