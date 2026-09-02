import { ChangeDetectorRef, Component, inject, NgZone, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, timeout } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PasoLegalConstructor } from './paso-legal/paso-legal';
import { PasoEspecialidadesConstructor } from './paso-especialidades/paso-especialidades';
import { PasoCredencialesConstructor } from './paso-credenciales/paso-credenciales';
import { ConstructorService } from '../core/services/constructor.service';
import { SocioService } from '../core/services/socio.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-registro-constructor',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
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
    private readonly socioService = inject(SocioService);

    pasoActual: number = 1;
    registroExitoso: boolean = false;
    cargando: boolean = false;
    errorRegistro: string | null = null;
    archivosLegales: { testimonio?: File, padron?: File } = {};
    datosRegistroFinal: any = null;

    formularioGeneral: FormGroup = this.fb.group({
        legal: this.fb.group({
            nombreEmpresa: ['', Validators.required],
            nit: ['', Validators.required],
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
        this.regenerarPassword();
        this.escucharNombreEmpresa();
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

    private escucharNombreEmpresa(): void {
        this.formularioGeneral.get('legal')?.get('nombreEmpresa')?.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(nombre => {
            const emailControl = this.formularioGeneral.get('credenciales')?.get('email');
            if (nombre && emailControl && !emailControl.dirty) {
                const base = nombre.toLowerCase().trim().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
                emailControl.patchValue(`${base}.constructora@link.com`, { emitEvent: false });
            }
        });
    }

    generarPassword(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    regenerarPassword(): void {
        this.formularioGeneral.get('credenciales')?.get('passwordGenerado')?.setValue(this.generarPassword());
    }

    onArchivosCambiados(archivos: any): void {
        this.archivosLegales = archivos;
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
        if (this.formularioGeneral.invalid || this.cargando) return;

        this.cargando = true;
        this.errorRegistro = null;
        this.cdr.detectChanges();

        const dataLegal = this.formLegal.getRawValue();
        const dataEsp = this.formEspecialidades.getRawValue();
        const dataCred = this.formCredenciales.getRawValue();

        const formData = new FormData();
        
        formData.append('nombreEmpresa', dataLegal.nombreEmpresa);
        formData.append('nit', dataLegal.nit);
        formData.append('representanteLegal', dataLegal.representanteLegal);
        
        formData.append('especialidades', JSON.stringify(dataEsp.especialidadesPrincipales));
        formData.append('maquinaria', JSON.stringify(dataEsp.maquinaria));
        
        formData.append('email', dataCred.email);
        formData.append('telefono', dataCred.telefono);
        formData.append('passwordGenerado', dataCred.passwordGenerado);
        formData.append('rol', 'constructor');

        if (this.archivosLegales.testimonio) {
            formData.append('testimonio', this.archivosLegales.testimonio);
        }
        if (this.archivosLegales.padron) {
            formData.append('padron', this.archivosLegales.padron);
        }

        this.socioService.registrarSocio(formData).subscribe({
            next: (res) => {
                this.ngZone.run(() => {
                    this.cargando = false;
                    this.registroExitoso = true;
                    this.datosRegistroFinal = res.data;
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.removeItem('constructorForm');
                    }
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.ngZone.run(() => {
                    this.cargando = false;
                    this.errorRegistro = err.error?.message || 'Error al intentar registrar la constructora.';
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

