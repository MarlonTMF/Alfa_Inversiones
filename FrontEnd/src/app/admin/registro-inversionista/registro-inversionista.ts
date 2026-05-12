import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SocioService } from '../../core/services/socio.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-registro-inversionista',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './registro-inversionista.html',
    styleUrl: './registro-inversionista.css'
})
export class RegistroInversionista implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private socioService = inject(SocioService);
    private cdr = inject(ChangeDetectorRef);

    registroExitoso = false;
    cargando = false;
    errorRegistro: string | null = null;
    datosRegistroFinal: any = null;

    formularioInversionista: FormGroup = this.fb.group({
        rol: ['inversor'],
        nombreCompleto: ['', Validators.required],
        ciDni: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        direccion: ['', Validators.required],
        profesion: ['', Validators.required],
        origenFondos: [''],
        passwordGenerado: [{ value: '', disabled: false }]
    });

    ngOnInit(): void {
        this.regenerarPassword();
    }

    regenerarPassword(): void {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.formularioInversionista.patchValue({ passwordGenerado: pass });
    }

    registrarInversionista(): void {
        if (this.formularioInversionista.valid) {
            this.cargando = true;
            this.errorRegistro = null;
            
            const datos = this.formularioInversionista.getRawValue();

            this.socioService.registrarInversionista(datos).subscribe({
                next: (res) => {
                    this.cargando = false;
                    this.registroExitoso = true;
                    this.datosRegistroFinal = res.data;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.cargando = false;
                    this.errorRegistro = err.error?.message || 'Error al intentar registrar el inversionista.';
                    console.error('Error registro inversionista:', err);
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.errorRegistro = 'Por favor completa todos los campos requeridos.';
        }
    }

    nuevoRegistro(): void {
        this.registroExitoso = false;
        this.formularioInversionista.reset({ rol: 'inversor' });
        this.regenerarPassword();
    }
}
