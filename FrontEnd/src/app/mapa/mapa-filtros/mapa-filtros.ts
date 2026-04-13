import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmenidadesService } from '../../services/amenidades';

@Component({
    selector: 'app-mapa-filtros',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mapa-filtros.html',
    styleUrl: './mapa-filtros.css'
})
export class MapaFiltros {
    public readonly amenidadesService = inject(AmenidadesService);
}