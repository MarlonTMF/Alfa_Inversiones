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
    @Output() siguiente = new EventEmitter<void>();

    onSiguiente(): void {
        this.siguiente.emit();
    }
}

