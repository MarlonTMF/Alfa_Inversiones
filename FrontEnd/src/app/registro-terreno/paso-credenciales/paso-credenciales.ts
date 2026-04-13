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
    @Output() finalizar = new EventEmitter<void>();
    @Output() atras = new EventEmitter<void>();

    regenerarPassword(): void {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.formulario.patchValue({ passwordGenerado: pass });
    }
}