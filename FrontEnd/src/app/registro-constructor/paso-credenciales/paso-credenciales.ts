import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-paso-credenciales-constructor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './paso-credenciales.html'
})
export class PasoCredencialesConstructor {
    @Input() formulario!: FormGroup;
    @Input() cargando: boolean = false;
    @Output() siguiente = new EventEmitter<void>();
    @Output() atras = new EventEmitter<void>();
    @Output() regenerar = new EventEmitter<void>();

    onSiguiente(): void {
        this.siguiente.emit();
    }

    onAtras(): void {
        this.atras.emit();
    }

    onRegenerar(): void {
        this.regenerar.emit();
    }
}

