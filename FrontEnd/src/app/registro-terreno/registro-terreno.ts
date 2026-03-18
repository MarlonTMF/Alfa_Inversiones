import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-registro-terreno',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './registro-terreno.html',
    styleUrl: './registro-terreno.css'
})
export class RegistroTerreno {
    pasoActual: number = 1;
    formularioPaso2: FormGroup;
    
    documentos: { [key: string]: File | null } = {
        folioReal: null,
        certificadoCatastral: null,
        cedula: null,
        planos: null
    };
    errorArchivo: string | null = null;

    constructor(private fb: FormBuilder) {
        this.formularioPaso2 = this.fb.group({
            ciudad: ['Cochabamba'],
            distrito: [''],
            uv: [''],
            zona: [''],
            direccion: ['', Validators.required],
            coordenadas: [''],
            superficie: ['', Validators.required],
            frente: [''],
            fondo: [''],
            precioBase: ['', Validators.required]
        });
    }

    manejarArchivo(event: any, tipo: string): void {
        const file = event.target.files[0];
        if (file) this.procesarArchivo(file, tipo);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent, tipo: string): void {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer?.files[0];
        if (file) this.procesarArchivo(file, tipo);
    }

    private procesarArchivo(file: File, tipo: string): void {
        this.errorArchivo = null;
        const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
        
        if (!tiposPermitidos.includes(file.type)) {
            this.errorArchivo = 'Solo se permiten formatos PDF, JPG y PNG.';
            return;
        }
        
        if (file.size > 15 * 1024 * 1024) {
            this.errorArchivo = 'El archivo supera el límite de 15MB.';
            return;
        }
        
        this.documentos[tipo] = file;
    }

    eliminarArchivo(tipo: string): void {
        this.documentos[tipo] = null;
    }

    esValidoPaso1(): boolean {
        return this.documentos['folioReal'] !== null && this.documentos['certificadoCatastral'] !== null;
    }

    pasoAnterior(): void {
        if (this.pasoActual > 1) {
            this.pasoActual--;
        }
    }

    siguientePaso(): void {
        if (this.pasoActual === 1 && this.esValidoPaso1()) {
            this.pasoActual = 2;
        } else if (this.pasoActual === 2 && this.formularioPaso2.valid) {
            this.pasoActual = 3;
        }
    }

    formatearPrecio(event: any): void {
        let valor = event.target.value.replace(/\D/g, "");
        if (valor) {
            valor = Number.parseInt(valor, 10).toLocaleString('en-US'); 
            this.formularioPaso2.patchValue({ precioBase: valor });
        }
    }
}