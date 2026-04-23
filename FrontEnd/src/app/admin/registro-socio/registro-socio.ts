import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SocioService } from '../../core/services/socio.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-registro-socio',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './registro-socio.html',
    styleUrl: './registro-socio.css'
})
export class RegistroSocio implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private socioService = inject(SocioService);

    registroExitoso = false;
    cargando = false;
    errorRegistro: string | null = null;
    datosRegistroFinal: any = null;

    formularioSocio: FormGroup = this.fb.group({
        rol: ['constructor', Validators.required],
        nombreEmpresa: ['', Validators.required],
        nit: ['', Validators.required],
        representanteLegal: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        passwordGenerado: [{ value: '', disabled: false }]
    });

    ngOnInit(): void {
        this.regenerarPassword();
        this.escucharNombreEmpresa();
    }

    private escucharNombreEmpresa(): void {
        this.formularioSocio.get('nombreEmpresa')?.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(nombre => {
            if (nombre && !this.formularioSocio.get('email')?.dirty) {
                const emailSugerido = this.generarEmailSugerido(nombre);
                this.formularioSocio.patchValue({ email: emailSugerido }, { emitEvent: false });
            }
        });
    }

    private generarEmailSugerido(nombre: string): string {
        const base = nombre.toLowerCase()
            .trim()
            .replace(/\s+/g, '.')
            .replace(/[^a-z0-9.]/g, '');
        return `${base}.constructora@365soft.com`;
    }

    regenerarPassword(): void {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.formularioSocio.patchValue({ passwordGenerado: pass });
    }

    registrarSocio(): void {
        if (this.formularioSocio.valid) {
            this.cargando = true;
            this.errorRegistro = null;
            
            // Asegurarnos de enviar el password generado aunque el campo esté disabled si fuera el caso
            const datos = this.formularioSocio.getRawValue();

            this.socioService.registrarSocio(datos).subscribe({
                next: (res) => {
                    this.cargando = false;
                    this.registroExitoso = true;
                    this.datosRegistroFinal = res.data;
                },
                error: (err) => {
                    this.cargando = false;
                    this.errorRegistro = err.error?.message || 'Error al intentar registrar el socio.';
                    console.error('Error registro socio:', err);
                }
            });
        }
    }

    nuevoRegistro(): void {
        this.registroExitoso = false;
        this.formularioSocio.reset({ rol: 'constructor' });
        this.regenerarPassword();
    }
}