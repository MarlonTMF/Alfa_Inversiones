import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private static readonly STORAGE_KEY = 'usuario365';

    public usuarioActual = signal<any>(null);

    private readonly usuariosDemo: Record<string, any> = {
        admin: { nombre: 'Administrador General', email: 'admin@link.com', rol: 'admin' },
        inversor: { nombre: 'Alejandro Vargas', email: 'alex@architect.com', rol: 'inversor' },
        inversionista: { nombre: 'Capital Inversiones S.A.', email: 'inv@empresa.com', rol: 'inversionista' },
        constructor: { nombre: 'Constructora Link S.R.L.', email: 'const@empresa.com', rol: 'constructor' },
        propietario: { nombre: 'Juan Quispe Mamani', email: 'prop@empresa.com', rol: 'propietario' },
    };

    constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
        this.verificarSesionGuardada();
    }

    private verificarSesionGuardada(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const usuarioDemo = params.get('demoUser');
        if (usuarioDemo && this.usuariosDemo[usuarioDemo]) {
            this.login(this.usuariosDemo[usuarioDemo]);
            return;
        }

        const usuarioGuardado = sessionStorage.getItem(AuthService.STORAGE_KEY)
            ?? localStorage.getItem(AuthService.STORAGE_KEY);

        if (usuarioGuardado) {
            this.usuarioActual.set(JSON.parse(usuarioGuardado));
        }
    }

    login(usuario: any): void {
        const usuarioNormalizado = {
            ...usuario,
            rol: (usuario?.rol || '').toLowerCase()
        };

        this.usuarioActual.set(usuarioNormalizado);
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(usuarioNormalizado));
            localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(usuarioNormalizado));
        }
    }

    logout(): void {
        this.usuarioActual.set(null);
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem(AuthService.STORAGE_KEY);
            localStorage.removeItem(AuthService.STORAGE_KEY);
        }
    }

    estaAutenticado(): boolean {
        return this.usuarioActual() !== null;
    }
}