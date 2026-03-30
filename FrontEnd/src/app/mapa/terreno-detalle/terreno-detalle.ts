import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terreno-detalle',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './terreno-detalle.html',
    styleUrl: './terreno-detalle.css'
})
export class TerrenoDetalle {
    @Input() terreno: any;
    @Output() cerrar = new EventEmitter<void>();

    cerrarPanel(): void {
        this.cerrar.emit();
    }
}