import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';
import { PublicNavbar } from '../layout/public-navbar/public-navbar';

@Component({
  selector: 'app-explorar-simulador',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Login, PublicNavbar],
  templateUrl: './explorar-simulador.html',
  styleUrl: './explorar-simulador.css'
})
export class ExplorarSimulador {
    public authService = inject(AuthService);
    public mostrarLogin: boolean = false;

    montoInversion = signal(450000);
    
    roiMensual = computed(() => {
        return (this.montoInversion() * 0.012).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
    });

    yieldAnual = computed(() => {
        return (this.montoInversion() * 0.144).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
    });

    onMontoChange(event: any) {
        this.montoInversion.set(Number(event.target.value));
    }

    get formattedMonto() {
        return this.montoInversion().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
    }

    procesarLogin({ usuario, token }: { usuario: any; token?: string }): void {
        this.authService.login(usuario, token);
        this.mostrarLogin = false;
    }
}
