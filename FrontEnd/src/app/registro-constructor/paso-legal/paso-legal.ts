import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-paso-legal-constructor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './paso-legal.html'
})
export class PasoLegalConstructor {
    @Input() formulario!: FormGroup;
    @Input() archivos: { testimonio?: File, padron?: File } = {};
    @Output() archivosCambiados = new EventEmitter<{ testimonio?: File, padron?: File }>();
    @Output() siguiente = new EventEmitter<void>();

    onFileSelected(event: any, tipo: 'testimonio' | 'padron'): void {
        const file = event.target.files[0];
        if (file) {
            this.archivos[tipo] = file;
            this.archivosCambiados.emit(this.archivos);
        }
    }

    onSiguiente(): void {
        this.siguiente.emit();
    }
}

