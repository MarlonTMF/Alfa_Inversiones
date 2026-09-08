import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private static readonly STORAGE_KEY = 'usuario365';
    /**
     * JWT real que firma el backend al hacer login (ver AutenticacionControlador).
     * Antes se generaba y nunca se usaba para nada: las peticiones al
     * backend que requerian ser admin mandaban en su lugar el id del
     * usuario en un header plano (x-admin-id), sin firma ni verificacion,
     * facil de falsificar. Ahora este token es el que via interceptor/
     * servicios se manda como 'Authorization: Bearer <token>'.
     */
    private static readonly TOKEN_KEY = 'authToken365';

    public usuarioActual = signal<any>(null);

    private readonly usuariosDemo: Record<string, any> = {
        admin: { id: '1', nombre: 'Administrador General', email: 'admin@365soft.com', rol: 'admin' },
        inversor: { id: '2', nombre: 'Alejandro Vargas', email: 'alex@architect.com', rol: 'inversor' },
        inversionista: { id: '3', nombre: 'Capital Inversiones S.A.', email: 'inv@empresa.com', rol: 'inversionista' },
        constructor: { id: '4', nombre: 'Constructora Link S.R.L.', email: 'const@empresa.com', rol: 'constructor' },
        propietario: { id: '5', nombre: 'Juan Quispe Mamani', email: 'prop@empresa.com', rol: 'propietario' },
    };

    /**
     * El parametro ?demoUser= por si solo daba acceso a cualquier rol,
     * incluido admin, a cualquiera que conociera o adivinara la URL, sin
     * pasar por ningun login. Ahora hace falta ademas un token de un solo
     * uso que solo se genera al pulsar una de las tarjetas de demo en la
     * landing (ver generarTokenDemo), asi que la funcion sigue igual para
     * quien la usa de verdad y deja de ser una puerta abierta por URL.
     */
    private static readonly DEMO_TOKEN_KEY = 'demoToken365';
    private static readonly DEMO_TOKEN_TTL_MS = 60_000;

    constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
        this.verificarSesionGuardada();
    }

    /** Genera y guarda el token de un solo uso que habilita el ?demoUser= de la siguiente ventana. */
    generarTokenDemo(rol: string): string {
        const token = `${rol}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(AuthService.DEMO_TOKEN_KEY, token);
        }
        return token;
    }

    private consumirTokenDemo(rol: string, token: string | null): boolean {
        if (!token || !isPlatformBrowser(this.platformId)) {
            return false;
        }
        const guardado = localStorage.getItem(AuthService.DEMO_TOKEN_KEY);
        localStorage.removeItem(AuthService.DEMO_TOKEN_KEY); // un solo uso, se consuma o no
        if (!guardado || guardado !== token) {
            return false;
        }
        const [rolGuardado, marca] = guardado.split(':');
        const vigente = Date.now() - Number(marca) < AuthService.DEMO_TOKEN_TTL_MS;
        return vigente && rolGuardado === rol;
    }

    private verificarSesionGuardada(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const usuarioDemo = params.get('demoUser');
        const token = params.get('demoToken');
        if (usuarioDemo && this.usuariosDemo[usuarioDemo] && this.consumirTokenDemo(usuarioDemo, token)) {
            this.login(this.usuariosDemo[usuarioDemo]);
            return;
        }

        const usuarioGuardado = sessionStorage.getItem(AuthService.STORAGE_KEY)
            ?? localStorage.getItem(AuthService.STORAGE_KEY);

        if (usuarioGuardado) {
            try {
                const parsed = JSON.parse(usuarioGuardado);
                const normalizado = {
                    id: parsed.id || '1',
                    ...parsed
                };
                this.usuarioActual.set(normalizado);
                sessionStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(normalizado));
                localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(normalizado));
            } catch {
                this.usuarioActual.set(null);
            }
        }
    }

    /**
     * @param token JWT real devuelto por POST /auth/login. Los logins que no
     * pasan por el backend real (modo demo, base simulada offline) no tienen
     * uno: en ese caso las llamadas que requieren rol admin simplemente
     * seran rechazadas por el backend en vez de aceptar un id sin verificar.
     */
    login(usuario: any, token?: string): void {
        const usuarioNormalizado = {
            id: usuario?.id || '1',
            ...usuario,
            rol: (usuario?.rol || '').toLowerCase()
        };

        this.usuarioActual.set(usuarioNormalizado);
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(usuarioNormalizado));
            localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(usuarioNormalizado));
            if (token) {
                localStorage.setItem(AuthService.TOKEN_KEY, token);
            } else {
                localStorage.removeItem(AuthService.TOKEN_KEY);
            }
        }
    }

    /** Token real del backend para la sesion actual, o null si no hay uno (login demo/simulado). */
    obtenerToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }
        return localStorage.getItem(AuthService.TOKEN_KEY);
    }

    logout(): void {
        this.usuarioActual.set(null);
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem(AuthService.STORAGE_KEY);
            localStorage.removeItem(AuthService.STORAGE_KEY);
            localStorage.removeItem(AuthService.TOKEN_KEY);
        }
    }

    estaAutenticado(): boolean {
        return this.usuarioActual() !== null;
    }

    /**
     * Ruta de inicio de cada rol. Es la unica fuente de verdad: la landing,
     * el navbar y cualquier pantalla que redirija tras iniciar sesion deben
     * usarla, para que un mismo perfil no aterrice en dos lugares distintos.
     */
    rutaInicioPorRol(rol: string | null | undefined): string {
        switch ((rol || '').toLowerCase()) {
            case 'admin':
            case 'super-admin':
                return '/admin/dashboard';
            case 'inversor':
            case 'inversionista':
                return '/inversor';
            case 'constructor':
                return '/constructor';
            case 'propietario':
                return '/registro-terreno';
            default:
                return '/mapa';
        }
    }

    rutaInicioUsuarioActual(): string {
        return this.rutaInicioPorRol(this.usuarioActual()?.rol);
    }
}