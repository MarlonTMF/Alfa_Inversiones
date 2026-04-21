import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

type Opcion = { id: string; label: string; group: 'especialidades' | 'maquinaria' };

@Component({
    selector: 'app-paso-especialidades-constructor',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './paso-especialidades.html'
})
export class PasoEspecialidadesConstructor {
    @Input() formulario!: FormGroup;
    @Output() siguiente = new EventEmitter<void>();
    @Output() atras = new EventEmitter<void>();

    opciones: Opcion[] = [
        { id: 'residencial', label: 'Residencial', group: 'especialidades' },
        { id: 'comercial', label: 'Comercial', group: 'especialidades' },
        { id: 'industrial', label: 'Industrial', group: 'especialidades' },
        { id: 'infraestructura', label: 'Infraestructura', group: 'especialidades' },
        { id: 'urbanismo', label: 'Urbanismo', group: 'especialidades' },
        { id: 'gruas', label: 'Grúas Torre', group: 'maquinaria' },
        { id: 'excavadoras', label: 'Excavadoras', group: 'maquinaria' },
        { id: 'hormigoneras', label: 'Hormigoneras', group: 'maquinaria' },
        { id: 'volquetas', label: 'Camiones Volquete', group: 'maquinaria' }
    ];

    toggle(item: Opcion): void {
        const controlName = item.group === 'especialidades' ? 'especialidadesPrincipales' : 'maquinaria';
        const actual: string[] = (this.formulario.get(controlName)?.value ?? []) as string[];
        const existe = actual.includes(item.id);
        const siguiente = existe ? actual.filter(x => x !== item.id) : [...actual, item.id];
        this.formulario.patchValue({ [controlName]: siguiente });
    }

    checked(item: Opcion): boolean {
        const controlName = item.group === 'especialidades' ? 'especialidadesPrincipales' : 'maquinaria';
        const actual: string[] = (this.formulario.get(controlName)?.value ?? []) as string[];
        return actual.includes(item.id);
    }

    onSiguiente(): void {
        this.siguiente.emit();
    }

    onAtras(): void {
        this.atras.emit();
    }
}

