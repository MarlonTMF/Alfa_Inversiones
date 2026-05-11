import { Component, EventEmitter, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

    esRegistro: boolean = false;
    mostrarContrasena: boolean = false;
    private readonly isBrowser: boolean;

    credenciales = {
        nombre: '',
        rol: '',
        email: '',
        password: ''
    };

    errorLogin: string | null = null;
    mensajeExito: string | null = null;

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
        // Forzamos la actualización para asegurar que los nuevos perfiles (como Alex) existan
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

    cambiarVista(): void {
        this.esRegistro = !this.esRegistro;
        this.errorLogin = null;
        this.mensajeExito = null;
        this.mostrarContrasena = false;
        this.credenciales = { nombre: '', rol: '', email: '', password: '' };
    }

    alternarContrasena(): void {
        this.mostrarContrasena = !this.mostrarContrasena;
    }

    private readonly apiUrl = 'http://localhost:3000/api/v1/auth';

    iniciarSesion(): void {
        if (!this.credenciales.email || !this.credenciales.password) {
            this.errorLogin = 'Ingresa tu correo completo y contraseña.';
            return;
        }

        // Bypass de emergencia para Alex (Inversor)
        if (this.credenciales.email === 'alex@architect.com' && this.credenciales.password === 'alex123') {
            const usuarioAlex = {
                nombre: 'Alex Vance',
                email: 'alex@architect.com',
                rol: 'inversor'
            };
            this.errorLogin = null;
            this.loginExitoso.emit(usuarioAlex);
            this.cerrarModal.emit();
            return;
        }

        // Bypass de emergencia para Constructora
        if (this.credenciales.email === 'constructor@apex.com' && this.credenciales.password === 'constructor123') {
            const usuarioConstructor = {
                nombre: 'Marcus Thorne',
                email: 'constructor@apex.com',
                rol: 'constructor'
            };
            this.errorLogin = null;
            this.loginExitoso.emit(usuarioConstructor);
            this.cerrarModal.emit();
            return;
        }

        // Primero intentamos con el Backend Real
        this.http.post<any>(`${this.apiUrl}/login`, {
            email: this.credenciales.email,
            password: this.credenciales.password
        }).subscribe({
            next: (res) => {
                this.errorLogin = null;
                this.loginExitoso.emit(res.usuario);
                this.cerrarModal.emit();
            },
            error: (err) => {
                console.error('API Login Error:', err);
                
                // Fallback a Base de Datos Simulada (para desarrollo/offline)
                if (this.isBrowser) {
                    const dbString = localStorage.getItem('usuariosDB');
                    const usuariosDB = dbString ? JSON.parse(dbString) : [];
                    const usuarioValido = usuariosDB.find(
                        (u: any) => u.email === this.credenciales.email && u.password === this.credenciales.password
                    );

                    if (usuarioValido) {
                        this.errorLogin = null;
                        this.loginExitoso.emit(usuarioValido);
                        this.cerrarModal.emit();
                        return;
                    }
                }
                this.errorLogin = 'Credenciales incorrectas o servidor no disponible.';
            }
        });
    }

    registrarse(): void {
        if (!this.credenciales.nombre || !this.credenciales.rol || !this.credenciales.email || !this.credenciales.password) {
            this.errorLogin = 'Completa todos los campos obligatorios.';
            return;
        }

        // Registro en el Backend Real
        this.http.post<any>(`${this.apiUrl}/register`, {
            nombre: this.credenciales.nombre,
            rol: this.credenciales.rol,
            email: this.credenciales.email,
            password: this.credenciales.password
        }).subscribe({
            next: () => {
                this.errorLogin = null;
                this.mensajeExito = 'Registro exitoso en servidor. Ya puedes iniciar sesión.';
                setTimeout(() => this.cambiarVista(), 2000);
            },
            error: (err) => {
                console.error('API Register Error:', err);
                
                // Fallback a Base de Datos Simulada
                if (this.isBrowser) {
                    const dbString = localStorage.getItem('usuariosDB');
                    const usuariosDB = dbString ? JSON.parse(dbString) : [];
                    if (usuariosDB.some((u: any) => u.email === this.credenciales.email)) {
                        this.errorLogin = 'Este correo ya existe en la base local.';
                        return;
                    }
                    usuariosDB.push({...this.credenciales});
                    localStorage.setItem('usuariosDB', JSON.stringify(usuariosDB));
                    this.mensajeExito = 'Registro local exitoso (Servidor no disponible).';
                    setTimeout(() => this.cambiarVista(), 2000);
                }
            }
        });
    }

}