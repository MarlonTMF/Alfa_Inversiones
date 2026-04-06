import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        if (this.authService.estaAutenticado()) {
            this.router.navigate(['/mapa']);
        }
    }
}