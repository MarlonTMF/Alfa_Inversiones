import { Component, EventEmitter, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../config/api.config';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login implements OnInit {
    @Output() cerrarModal = new EventEmitter<void>();
    @Output() loginExitoso = new EventEmitter<any>();

    mostrarContrasena: boolean = false;
    private readonly isBrowser: boolean;

    credenciales = {
        email: '',
        password: ''
    };

    errorLogin: string | null = null;
    private readonly apiUrl = `${API_URL}/auth`;

    constructor(
        private readonly http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        if (this.isBrowser) {
            this.inicializarBaseDeDatosSimulada();
        }
    }

    private inicializarBaseDeDatosSimulada(): void {
        this.http.get<any[]>('/mock-data/usuarios.json').subscribe({
            next: (data) => {
                localStorage.setItem('usuariosDB', JSON.stringify(data));
                console.log('Base de datos simulada actualizada');
            },
            error: (err) => {
                console.error('Error al cargar usuarios.json:', err);
            }
        });
    }

    cerrar(): void {
        this.cerrarModal.emit();
    }

    alternarContrasena(): void {
        this.mostrarContrasena = !this.mostrarContrasena;
    }

    iniciarSesion(): void {
        if (!this.credenciales.email || !this.credenciales.password) {
            this.errorLogin = 'Ingresa tu correo y contraseña.';
            return;
        }

        // Los usuarios de demostración (ver DEMO_*.md) se validan primero
        // contra la base simulada: es instantáneo, sin esperar al backend,
        // y es la única fuente de verdad en vez de tener las mismas
        // credenciales repetidas también aquí como bypass.
        if (this.intentarLoginSimulado()) {
            return;
        }

        // Backend Real
        this.http.post<any>(`${this.apiUrl}/login`, {
            email: this.credenciales.email,
            password: this.credenciales.password
        }).subscribe({
            next: (res) => {
                this.errorLogin = null;
                const usuario = res.usuario ? { id: res.usuario.id || '1', ...res.usuario } : res.usuario;
                this.loginExitoso.emit(usuario);
                this.cerrarModal.emit();
            },
            error: (err) => {
                console.error('API Login Error:', err);

                // Reintenta contra la base simulada por si se cargó después
                // del primer intento (inicializarBaseDeDatosSimulada es async).
                if (!this.intentarLoginSimulado()) {
                    this.errorLogin = 'Credenciales incorrectas o acceso denegado.';
                }
            }
        });
    }

    /** true si encontró y emitió un usuario de la base de datos simulada. */
    private intentarLoginSimulado(): boolean {
        if (!this.isBrowser) {
            return false;
        }
        const dbString = localStorage.getItem('usuariosDB');
        const usuariosDB = dbString ? JSON.parse(dbString) : [];
        const usuarioValido = usuariosDB.find(
            (u: any) => u.email === this.credenciales.email && u.password === this.credenciales.password
        );
        if (!usuarioValido) {
            return false;
        }
        this.errorLogin = null;
        const usuarioNormalizado = { id: usuarioValido.id || '1', ...usuarioValido };
        this.loginExitoso.emit(usuarioNormalizado);
        this.cerrarModal.emit();
        return true;
    }
}