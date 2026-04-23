import { ChangeDetectorRef, Component, inject, NgZone, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { PasoDocumentacion } from './paso-documentacion/paso-documentacion';
import { PasoEspecificaciones } from './paso-especificaciones/paso-especificaciones';
import { PasoCredenciales } from './paso-credenciales/paso-credenciales';
import { TerrenoService } from '../core/services/terreno.service';

@Component({
    selector: 'app-registro-terreno',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, PasoDocumentacion, PasoEspecificaciones, PasoCredenciales],
    templateUrl: './registro-terreno.html',
    styleUrl: './registro-terreno.css',
    encapsulation: ViewEncapsulation.None
})
export class RegistroTerreno implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly terrenoService = inject(TerrenoService);
    private readonly ngZone = inject(NgZone);
    private readonly cdr = inject(ChangeDetectorRef);

    pasoActual: number = 1;
    registroExitoso: boolean = false;
    cargando: boolean = false;
    errorRegistro: string | null = null;

    formularioGeneral: FormGroup = this.fb.group({
        especificaciones: this.fb.group({
            categoria: ['', Validators.required],
            categoriaOtro: [''],
            ciudad: ['', Validators.required],
            distrito: [''],
            uv: [''],
            zona: [''],
            direccion: ['', Validators.required],
            coordenadas: ['', Validators.required],
            superficie: ['', Validators.required],
            frente: [''],
            fondo: [''],
            precioBase: ['', Validators.required]
        }),
        credenciales: this.fb.group({
            rol: ['propietario', Validators.required],
            nombrePropietario: ['', Validators.required],
            emailPropietario: ['', [Validators.required, Validators.email]],
            telefonoPropietario: ['', Validators.required],
            passwordGenerado: [{ value: '', disabled: false }]
        })
    });

    documentos: { [key: string]: File[] } = {
        folioReal: [],
        certificadoCatastral: [],
        multimedia: [],
        adicional: []
    };

    ngOnInit(): void {
        this.formularioGeneral.get('credenciales')?.get('passwordGenerado')?.setValue(this.generarPassword());

        if (isPlatformBrowser(this.platformId)) {
            const guardado = sessionStorage.getItem('terrenoForm');
            if (guardado) {
                try {
                    const datos = JSON.parse(guardado);
                    this.formularioGeneral.patchValue(datos);
                } catch {
                    // Ignorar datos corruptos en sessionStorage.
                }
            }

            this.formularioGeneral.valueChanges.subscribe(val => {
                sessionStorage.setItem('terrenoForm', JSON.stringify(val));
            });
        }
    }

    generarPassword(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let pass = '';
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    actualizarDocumentos(nuevosDocs: any): void {
        this.documentos = { ...nuevosDocs };
    }

    esValidoPaso1(): boolean {
        return (this.documentos['folioReal']?.length > 0) && (this.documentos['certificadoCatastral']?.length > 0);
    }

    irAPaso(paso: number): void {
        if (paso === 1) {
            this.pasoActual = 1;
        } else if (paso === 2 && this.esValidoPaso1()) {
            this.pasoActual = 2;
        } else if (paso === 3 && this.esValidoPaso1() && this.formularioGeneral.get('especificaciones')?.valid) {
            this.pasoActual = 3;
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

        if (this.formularioGeneral.invalid || !this.esValidoPaso1()) {
            this.errorRegistro = 'Por favor, completa todos los campos obligatorios.';
            this.cdr.detectChanges();
            return;
        }

        const dataBase = this.construirPayloadRegistro();
        if (!dataBase) {
            this.cdr.detectChanges();
            return;
        }

        const formData = new FormData();
        // Agregamos campos básicos
        Object.keys(dataBase).forEach(key => {
            if (dataBase[key] !== null && dataBase[key] !== undefined) {
                formData.append(key, dataBase[key]);
            }
        });

        // Agregamos archivos
        if (this.documentos['folioReal']?.[0]) {
            formData.append('folioReal', this.documentos['folioReal'][0]);
        }
        if (this.documentos['certificadoCatastral']?.[0]) {
            formData.append('catastro', this.documentos['certificadoCatastral'][0]);
        }
        if (this.documentos['multimedia']?.length > 0) {
            this.documentos['multimedia'].forEach(file => {
                formData.append('multimedia', file);
            });
        }
        if (this.documentos['adicional']?.length > 0) {
            this.documentos['adicional'].forEach(file => {
                formData.append('adicional', file);
            });
        }

        console.log('Enviando registro de terreno con archivos...');
        this.cargando = true;
        this.errorRegistro = null;
        this.cdr.detectChanges();

        this.terrenoService.registrarTerrenoCompleto(formData).pipe(
            timeout(15000),
            finalize(() => {
                this.ngZone.run(() => {
                    console.log('Finalizó flujo de registro de terreno');
                    this.cargando = false;
                    this.cdr.detectChanges();
                });
            })
        ).subscribe({
            next: (respuesta) => {
                this.ngZone.run(() => {
                    console.log('Registro de terreno exitoso:', respuesta);
                    this.registroExitoso = true;
                    if (isPlatformBrowser(this.platformId)) {
                        sessionStorage.removeItem('terrenoForm');
                    }
                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                this.ngZone.run(() => {
                    console.error('Error al registrar terreno:', err);
                    this.errorRegistro = this.obtenerMensajeErrorRegistro(err);
                    this.cdr.detectChanges();
                });
            }
        });
    }

    irAlMapa(): void {
        this.router.navigate(['/admin/mapa']);
    }

    get formEspecificaciones(): FormGroup {
        return this.formularioGeneral.get('especificaciones') as FormGroup;
    }

    get formCredenciales(): FormGroup {
        return this.formularioGeneral.get('credenciales') as FormGroup;
    }

    private construirPayloadRegistro(): any | null {
        const rawData = this.formularioGeneral.getRawValue();
        const especificaciones = rawData.especificaciones;

        const precioBase = this.parseNumero(especificaciones.precioBase);
        const superficie = this.parseNumero(especificaciones.superficie);
        const frente = this.parseNumeroOpcional(especificaciones.frente);
        const fondo = this.parseNumeroOpcional(especificaciones.fondo);

        if (precioBase === null || superficie === null) {
            this.errorRegistro = 'El precio base y la superficie deben tener valores numéricos válidos.';
            return null;
        }

        if (!this.esGeoJsonValido(especificaciones.coordenadas)) {
            this.errorRegistro = 'Las coordenadas del terreno no son válidas. Vuelve a cerrar el polígono.';
            return null;
        }

        return {
            ...especificaciones,
            ...rawData.credenciales,
            precioBase,
            superficie,
            frente,
            fondo
        };
    }

    private parseNumero(valor: unknown): number | null {
        if (valor === null || valor === undefined || valor === '') {
            return null;
        }

        const normalizado = valor.toString().replace(/,/g, '').trim();
        const numero = Number.parseFloat(normalizado);
        return Number.isFinite(numero) ? numero : null;
    }

    private parseNumeroOpcional(valor: unknown): number | null {
        if (valor === null || valor === undefined || valor === '') {
            return null;
        }

        return this.parseNumero(valor);
    }

    private esGeoJsonValido(coordenadas: unknown): boolean {
        if (typeof coordenadas !== 'string' || !coordenadas.trim()) {
            return false;
        }

        try {
            const geoJson = JSON.parse(coordenadas);
            const puntos = geoJson?.coordinates?.[0];
            return Array.isArray(puntos) && puntos.length >= 4;
        } catch {
            return false;
        }
    }

    private obtenerMensajeErrorRegistro(err: any): string {
        if (err?.name === 'TimeoutError') {
            return 'El servidor tardó demasiado en responder. Intenta nuevamente.';
        }

        if (err?.status === 409) {
            return err?.error?.message || 'El correo del propietario ya está registrado. Usa otro correo para crear el terreno.';
        }

        if (err?.status === 400) {
            return err?.error?.message || 'Los datos enviados no son válidos. Revisa el formulario.';
        }

        return 'Hubo un error al guardar los datos en el servidor. Revisa tu conexión.';
    }
}
