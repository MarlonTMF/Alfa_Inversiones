import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-gestion-terrenos',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './gestion-terrenos.html',
    styleUrl: './gestion-terrenos.css'
})
export class GestionTerrenos {
    public textoBusqueda: string = '';
    public filtroUbicacion: string = 'Todos';
    public filtroTipo: string = 'Todos';
    public filtroEstado: string = 'Todos';

    terrenos = [
        { 
            id: 'MX-8829', 
            nombre: 'Lote Sector Sur', 
            propietario: 'Ricardo Aranda', 
            valor: '1.2M', 
            area: '2,450', 
            tipo: 'Residencial', 
            estado: 'DISPONIBLE', 
            estadoClase: 'estado-disponible',
            ubicacion: 'Sur',
            img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
        },
        { 
            id: 'MX-8830', 
            nombre: 'Edificio Corporativo A1', 
            propietario: 'Grupo Inmobiliario Altus', 
            valor: '8.5M', 
            area: '12,000', 
            tipo: 'Comercial', 
            estado: 'EN TRÁMITE', 
            estadoClase: 'estado-tramite',
            ubicacion: 'Centro',
            img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
        },
        { 
            id: 'MX-8831', 
            nombre: 'Villa Los Olivos', 
            propietario: 'Sofia Villalobos', 
            valor: '2.7M', 
            area: '850', 
            tipo: 'Residencial', 
            estado: 'ESCRITURADO', 
            estadoClase: 'estado-escriturado',
            ubicacion: 'Norte',
            img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
        }
    ];

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