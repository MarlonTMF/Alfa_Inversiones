import { Component, inject, ViewEncapsulation, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasoDocumentacion } from './paso-documentacion/paso-documentacion';
import { PasoEspecificaciones } from './paso-especificaciones/paso-especificaciones';
import { PasoCredenciales } from './paso-credenciales/paso-credenciales';

@Component({
    selector: 'app-registro-terreno',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, PasoDocumentacion, PasoEspecificaciones, PasoCredenciales],
    templateUrl: './registro-terreno.html',
    styleUrl: './registro-terreno.css',
    encapsulation: ViewEncapsulation.None
})
export class RegistroTerreno implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);

    pasoActual: number = 1;
    
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
            passwordGenerado: [{ value: '', disabled: true }]
        })
    });

    documentos: { [key: string]: File[] } = {
        folioReal: [],
        certificadoCatastral: [],
        multimedia: [],
        adicional: []
    };

    ngOnInit(): void {
        this.formularioGeneral.get('credenciales')?.patchValue({
            passwordGenerado: this.generarPassword()
        });

        if (isPlatformBrowser(this.platformId)) {
            const guardado = sessionStorage.getItem('terrenoForm');
            if (guardado) {
                try {
                    const datos = JSON.parse(guardado);
                    this.formularioGeneral.patchValue(datos);
                } catch (e) {}
            }

            this.formularioGeneral.valueChanges.subscribe(val => {
                sessionStorage.setItem('terrenoForm', JSON.stringify(val));
            });
        }
    }

    generarPassword(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
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
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('terrenoForm');
        }
        this.router.navigate(['/mapa']);
    }
}