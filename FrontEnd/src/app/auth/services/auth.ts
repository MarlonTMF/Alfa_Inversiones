import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    
    public usuarioActual = signal<any>(null);
    constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
        this.verificarSesionGuardada();
    }

    private verificarSesionGuardada(): void {
        if (isPlatformBrowser(this.platformId)) {
            const usuarioGuardado = localStorage.getItem('usuario365');
            if (usuarioGuardado) {
                this.usuarioActual.set(JSON.parse(usuarioGuardado));
            }
        }
    }

    login(usuario: any): void {
        this.usuarioActual.set(usuario);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('usuario365', JSON.stringify(usuario));
        }
    }

    logout(): void {
        this.usuarioActual.set(null);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('usuario365');
        }
    }

    estaAutenticado(): boolean {
        return this.usuarioActual() !== null;
    }
}