import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-paso-credenciales',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './paso-credenciales.html'
})
export class PasoCredenciales {
    @Input() formulario!: FormGroup;
    @Input() cargando: boolean = false;
    @Output() siguiente = new EventEmitter<void>();
    @Output() atras = new EventEmitter<void>();

    onSiguiente(): void {
        this.siguiente.emit();
    }

    onAtras(): void {
        this.atras.emit();
    }

    regenerarPassword(): void {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.formulario.patchValue({ passwordGenerado: pass });
    }
}