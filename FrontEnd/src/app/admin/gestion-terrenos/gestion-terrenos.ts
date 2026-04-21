import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-gestion-terrenos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './gestion-terrenos.html',
    styleUrl: './gestion-terrenos.css'
})
export class GestionTerrenos {
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
            img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
        }
    ];
}