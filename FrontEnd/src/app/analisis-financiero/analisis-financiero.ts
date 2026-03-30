import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-analisis-financiero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analisis-financiero.html',
    styleUrl: './analisis-financiero.css'
})
export class AnalisisFinanciero implements OnInit {
    private readonly http = inject(HttpClient);
    private readonly route = inject(ActivatedRoute);

    public datosDashboard: any = null;
    public cargando: boolean = true;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id') || 'default';
        this.cargarDatosFinancieros(id);
    }

    private cargarDatosFinancieros(id: string): void {
        this.cargando = true;

        // TO-DO REFACTOR BACKEND: Cambiar esta URL por la ruta de la API real
        // this.http.get(`http://localhost:3000/api/v1/analisis-financiero/${id}`).subscribe(...)

        setTimeout(() => {
            this.datosDashboard = {
                ciudad: 'Santa Cruz',
                distrito: 'Distrito Equipetrol',
                uv: 'UV 013',
                direccion: 'Av. San Martin, Calle 7 Este',
                roi: 22.4,
                incidencia: 18.5,
                construccionM2: 850,
                capacidadNiveles: 12,
                adquisicionTotal: 450000,
                tamanoM2: 850,
                precioM2Terreno: 529,
                asesorVision: 'La incidencia del terreno está un 3.5% por debajo del promedio del distrito. Recomendamos aumentar el área comercial en planta baja para impulsar la ganancia neta en ~4.2%.',
                imagenTerreno: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
            };
            this.cargando = false;
        }, 800);
    }
}