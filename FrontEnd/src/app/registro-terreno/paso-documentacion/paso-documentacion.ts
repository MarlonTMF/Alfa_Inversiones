import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-paso-documentacion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paso-documentacion.html'
})
export class PasoDocumentacion implements OnInit, OnDestroy {
    @Input() documentos!: { [key: string]: File[] };
    @Output() documentosCambiados = new EventEmitter<any>();
    @Output() siguiente = new EventEmitter<void>();

    errorArchivo: string | null = null;
    fileUrls: Map<File, string> = new Map();

    ngOnInit(): void {
        for (const key in this.documentos) {
            this.documentos[key] = this.documentos[key].filter(doc => doc instanceof File);
            this.documentos[key].forEach(doc => {
                if (!this.fileUrls.has(doc)) {
                    this.fileUrls.set(doc, URL.createObjectURL(doc));
                }
            });
        }
        this.documentosCambiados.emit(this.documentos);
    }

    ngOnDestroy(): void {}

    manejarArchivos(event: any, tipo: string): void {
        const files = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.procesarArchivo(files[i], tipo);
            }
        }
        event.target.value = '';
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
            this.errorArchivo = `Formato no válido. Archivo: ${file.name}`;
            return;
        }
        
        if (file.size > maxSize) {
            this.errorArchivo = `El archivo supera el límite permitido. Archivo: ${file.name}`;
            return;
        }

        this.fileUrls.set(file, URL.createObjectURL(file));

        const nuevoArreglo = (tipo === 'folioReal' || tipo === 'certificadoCatastral')
            ? [file] 
            : [...this.documentos[tipo], file];

        this.documentos = {
            ...this.documentos,
            [tipo]: nuevoArreglo
        };
        
        this.documentosCambiados.emit(this.documentos);
    }

    eliminarArchivo(tipo: string, index: number): void {
        const fileToDelete = this.documentos[tipo][index];
        if (fileToDelete && this.fileUrls.has(fileToDelete)) {
            URL.revokeObjectURL(this.fileUrls.get(fileToDelete)!);
            this.fileUrls.delete(fileToDelete);
        }

        const nuevoArreglo = [...this.documentos[tipo]];
        nuevoArreglo.splice(index, 1);
        
        this.documentos = {
            ...this.documentos,
            [tipo]: nuevoArreglo
        };
        
        this.documentosCambiados.emit(this.documentos);
    }

    obtenerUrl(file: File): string {
        return this.fileUrls.get(file) || '';
    }

    abrirArchivo(file: File): void {
        const url = this.obtenerUrl(file);
        if (url) {
            window.open(url, '_blank');
        }
    }

    esValido(): boolean {
        const folioOk = this.documentos['folioReal']?.length > 0 && this.documentos['folioReal'][0] instanceof File;
        const catastralOk = this.documentos['certificadoCatastral']?.length > 0 && this.documentos['certificadoCatastral'][0] instanceof File;
        return folioOk && catastralOk;
    }
}