import { ChangeDetectorRef, Component, inject, NgZone, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, timeout } from 'rxjs/operators';
import { PasoLegalConstructor } from './paso-legal/paso-legal';
import { PasoEspecialidadesConstructor } from './paso-especialidades/paso-especialidades';
import { PasoCredencialesConstructor } from './paso-credenciales/paso-credenciales';
import { ConstructorService } from '../core/services/constructor.service';

@Component({
    selector: 'app-registro-constructor',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PasoLegalConstructor,
        PasoEspecialidadesConstructor,
        PasoCredencialesConstructor
    ],
    templateUrl: './registro-constructor.html',
    styleUrl: './registro-constructor.css',
    encapsulation: ViewEncapsulation.None
})
export class RegistroConstructor implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly constructorService = inject(ConstructorService);
    private readonly ngZone = inject(NgZone);
    private readonly cdr = inject(ChangeDetectorRef);

    pasoActual: number = 1;
    registroExitoso: boolean = false;
    cargando: boolean = false;
    errorRegistro: string | null = null;

    formularioGeneral: FormGroup = this.fb.group({
        legal: this.fb.group({
            nombreEmpresa: ['', Validators.required],
            nit: [''],
            representanteLegal: ['', Validators.required]
        }),
        especialidades: this.fb.group({
            especialidadesPrincipales: [[], Validators.required],
            maquinaria: [[]]
        }),
        credenciales: this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            telefono: [''],
            passwordGenerado: [{ value: '', disabled: false }, Validators.required]
        })
    });

    ngOnInit(): void {
        this.formularioGeneral.get('credenciales')?.get('passwordGenerado')?.setValue(this.generarPassword());

        if (isPlatformBrowser(this.platformId)) {
            const guardado = sessionStorage.getItem('constructorForm');
            if (guardado) {
                try {
                    const datos = JSON.parse(guardado);
                    this.formularioGeneral.patchValue(datos);
                } catch {
                    // ignore
                }
            }

            this.formularioGeneral.valueChanges.subscribe(val => {
                sessionStorage.setItem('constructorForm', JSON.stringify(val));
            });
        }
    }

    generarPassword(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let pass = '';
        for (let i = 0; i < 10; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    regenerarPassword(): void {
        this.formularioGeneral.get('credenciales')?.get('passwordGenerado')?.setValue(this.generarPassword());
    }

    irAPaso(paso: number): void {
        if (paso === 1) {
            this.pasoActual = 1;
            return;
        }

        if (paso === 2 && this.formLegal.valid) {
            this.pasoActual = 2;
            return;
        }

        if (paso === 3 && this.formLegal.valid && this.formEspecialidades.valid) {
            this.pasoActual = 3;
            return;
        }
    }

    avanzar(): void {
        this.irAPaso(this.pasoActual + 1);
    }

    retroceder(): void {
        if (this.pasoActual > 1) {
            this.pasoActual--;
        }
    }

    finalizarRegistro(): void {
        if (this.cargando) {
            return;
        }

        if (this.formularioGeneral.invalid) {
            this.errorRegistro = 'Por favor, completa todos los campos obligatorios.';
            this.cdr.detectChanges();
            return;
        }

        const legal = this.formLegal.getRawValue();
        const cred = this.formCredenciales.getRawValue();

        const payload = {
            nombre: legal.nombreEmpresa,
            email: cred.email,
            password: cred.passwordGenerado
        };

        this.cargando = true;
        this.errorRegistro = null;
        this.cdr.detectChanges();

        this.constructorService.registrarConstructor(payload).pipe(
            timeout(15000),
            finalize(() => {
                this.ngZone.run(() => {
                    this.cargando = false;
                    this.cdr.detectChanges();
                });
            })
        ).subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.registroExitoso = true;
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.removeItem('constructorForm');
                    }
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.ngZone.run(() => {
                    this.errorRegistro = this.obtenerMensajeErrorRegistro(err);
                    this.cdr.detectChanges();
                });
            }
        });
    }

    private obtenerMensajeErrorRegistro(err: any): string {
        if (err?.name === 'TimeoutError') {
            return 'El servidor tardó demasiado en responder. Intenta nuevamente.';
        }

        if (err?.status === 409) {
            return err?.error?.message || 'Este correo ya está registrado. Usa otro correo.';
        }

        if (err?.status === 400) {
            return err?.error?.message || 'Los datos enviados no son válidos. Revisa el formulario.';
        }

        return 'Hubo un error al registrar el constructor. Revisa tu conexión.';
    }

    get formLegal(): FormGroup {
        return this.formularioGeneral.get('legal') as FormGroup;
    }

    get formEspecialidades(): FormGroup {
        return this.formularioGeneral.get('especialidades') as FormGroup;
    }

    get formCredenciales(): FormGroup {
        return this.formularioGeneral.get('credenciales') as FormGroup;
    }
}

