import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TerrenoService } from '../../core/services/terreno.service';
import { imagenPrincipal } from '../../core/media';

@Component({
    selector: 'app-gestion-terrenos',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './gestion-terrenos.html',
    styleUrl: './gestion-terrenos.css'
})
export class GestionTerrenos implements OnInit {
    private readonly terrenoService = inject(TerrenoService);
    private readonly cdr = inject(ChangeDetectorRef);

    public textoBusqueda: string = '';
    public filtroUbicacion: string = 'Todos';
    public filtroTipo: string = 'Todos';
    public filtroEstado: string = 'Todos';

    public terrenos: any[] = [];

    ngOnInit(): void {
        this.cargarTerrenos();
    }

    private cargarTerrenos(): void {
        this.terrenoService.obtenerPropiedades().subscribe({
            next: (data) => {
                this.terrenos = data.map(t => {
                    const category = (t.category && t.category !== 'null') ? t.category : 'Terreno';
                    const city = (t.city && t.city !== 'null') ? t.city : 'Desconocido';
                    const address = (t.exactAddress && t.exactAddress !== 'null') ? t.exactAddress : null;

                    return {
                        ...t,
                        idDisplay: t.id.split('-')[0].toUpperCase(),
                        nombre: address || (category + ' en ' + city),
                        propietario: t.nombrePropietario || (t.creator?.nombre || 'Sin Propietario'),
                        valor: this.formatearPrecio(t.basePriceNegotiation),
                        area: t.totalArea || 0,
                        tipo: category,
                        estado: t.status || 'DISPONIBLE',
                        estadoClase: (t.status || 'DISPONIBLE').toLowerCase() === 'disponible' ? 'estado-disponible' : 'estado-tramite',
                        ubicacion: city,
                        img: imagenPrincipal(t.multimedia)
                    };
                });
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error al cargar terrenos:', err)
        });
    }

    private formatearPrecio(precio: any): string {
        if (!precio) return '0';
        const num = parseFloat(precio);
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    get ubicaciones() {
        return ['Todos', ...new Set(this.terrenos.map(t => t.ubicacion))];
    }

    get tipos() {
        return ['Todos', ...new Set(this.terrenos.map(t => t.tipo))];
    }

    get estados() {
        return ['Todos', ...new Set(this.terrenos.map(t => t.estado))];
    }

    get terrenosFiltrados() {
        return this.terrenos.filter(t => {
            const matchBusqueda = t.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) || 
                                  t.id.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
                                  t.propietario.toLowerCase().includes(this.textoBusqueda.toLowerCase());
            
            const matchUbicacion = this.filtroUbicacion === 'Todos' || t.ubicacion === this.filtroUbicacion;
            const matchTipo = this.filtroTipo === 'Todos' || t.tipo === this.filtroTipo;
            const matchEstado = this.filtroEstado === 'Todos' || t.estado === this.filtroEstado;

            return matchBusqueda && matchUbicacion && matchTipo && matchEstado;
        });
    }
}