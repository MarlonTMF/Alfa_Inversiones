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
        if (!localStorage.getItem('usuariosDB')) {
            this.http.get<any[]>('/mock-data/usuarios.json').subscribe({
                next: (data) => {
                    localStorage.setItem('usuariosDB', JSON.stringify(data));
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
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

    iniciarSesion(): void {
        if (!this.credenciales.email || !this.credenciales.password) {
            this.errorLogin = 'Ingresa tu correo completo y contrasena.';
            return;
        }

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
            } else {
                this.errorLogin = 'Credenciales incorrectas.';
            }
        }
    }

    registrarse(): void {
        if (!this.credenciales.nombre || !this.credenciales.rol || !this.credenciales.email || !this.credenciales.password) {
            this.errorLogin = 'Completa todos los campos obligatorios.';
            return;
        }

        if (this.isBrowser) {
            const dbString = localStorage.getItem('usuariosDB');
            const usuariosDB = dbString ? JSON.parse(dbString) : [];

            const existeCorreo = usuariosDB.some((u: any) => u.email === this.credenciales.email);

            if (existeCorreo) {
                this.errorLogin = 'Este correo electronico ya esta registrado.';
                return;
            }

            const nuevoUsuario = {
                nombre: this.credenciales.nombre,
                rol: this.credenciales.rol,
                email: this.credenciales.email,
                password: this.credenciales.password
            };

            usuariosDB.push(nuevoUsuario);
            localStorage.setItem('usuariosDB', JSON.stringify(usuariosDB));

            this.errorLogin = null;
            this.mensajeExito = 'Registro exitoso. Ya puedes iniciar sesion.';
            
            setTimeout(() => {
                this.cambiarVista();
            }, 2000);
        }
    }
}