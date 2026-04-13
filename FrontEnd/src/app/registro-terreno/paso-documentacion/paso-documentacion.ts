import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-paso-documentacion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paso-documentacion.html'
})
export class PasoDocumentacion {
    @Input() documentos!: { [key: string]: File[] };
    @Output() documentosChange = new EventEmitter<any>();
    @Output() siguiente = new EventEmitter<void>();

    errorArchivo: string | null = null;

    manejarArchivos(event: any, tipo: string): void {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.procesarArchivo(files[i], tipo);
            }
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent, tipo: string): void {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer?.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.procesarArchivo(files[i], tipo);
            }
        }
    }

    private procesarArchivo(file: File, tipo: string): void {
        this.errorArchivo = null;
        let tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
        let maxSize = 15 * 1024 * 1024;
        
        if (tipo === 'multimedia') {
            tiposPermitidos = ['image/jpeg', 'image/png', 'video/mp4'];
            maxSize = 100 * 1024 * 1024;
        } else if (tipo === 'adicional') {
            tiposPermitidos = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
        }
        
        if (!tiposPermitidos.includes(file.type)) {
            this.errorArchivo = 'Formato de archivo no válido para esta sección.';
            return;
        }
        
        if (file.size > maxSize) {
            this.errorArchivo = 'El archivo supera el límite de tamaño permitido.';
            return;
        }

        const nuevoArreglo = (tipo === 'folioReal' || tipo === 'certificadoCatastral')
            ? [file] 
            : [...this.documentos[tipo], file];

        this.documentos = {
            ...this.documentos,
            [tipo]: nuevoArreglo
        };
        
        this.documentosChange.emit(this.documentos);
    }

    eliminarArchivo(tipo: string, index: number): void {
        const nuevoArreglo = [...this.documentos[tipo]];
        nuevoArreglo.splice(index, 1);
        
        this.documentos = {
            ...this.documentos,
            [tipo]: nuevoArreglo
        };
        
        this.documentosChange.emit(this.documentos);
    }

    esValido(): boolean {
        return (this.documentos['folioReal']?.length > 0) && (this.documentos['certificadoCatastral']?.length > 0);
    }
}