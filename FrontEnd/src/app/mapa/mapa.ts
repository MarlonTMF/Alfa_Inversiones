import { Component, AfterViewInit, PLATFORM_ID, Inject, NgZone, effect, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AmenidadesService } from '../services/amenidades';

@Component({
    selector: 'app-mapa',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mapa.html',
    styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit {
    terrenoSeleccionado: any = null;

    private map: any;
    private capaMercados: any;
    private capaTransporte: any;
    private capaColegios: any;
    private capaHospitales: any;
    private readonly amenidadesService = inject(AmenidadesService);

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly http: HttpClient,
        private readonly zone: NgZone,
        private readonly cdr: ChangeDetectorRef
    ) {
        effect(() => {
            const mostrarHosp = this.amenidadesService.mostrarHospitales();
            const mostrarCol = this.amenidadesService.mostrarColegios();
            const mostrarMerc = this.amenidadesService.mostrarMercados();
            const mostrarTrans = this.amenidadesService.mostrarTransporte();

            if (!this.map || !this.capaHospitales) return;

            mostrarHosp ? this.map.addLayer(this.capaHospitales) : this.map.removeLayer(this.capaHospitales);
            mostrarCol ? this.map.addLayer(this.capaColegios) : this.map.removeLayer(this.capaColegios);
            mostrarMerc ? this.map.addLayer(this.capaMercados) : this.map.removeLayer(this.capaMercados);
            mostrarTrans ? this.map.addLayer(this.capaTransporte) : this.map.removeLayer(this.capaTransporte);
        });
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.iniciarLeaflet();
        }
    }

    private iniciarLeaflet(): void {
        import('leaflet')
            .then((L) => this.gestionarGeolocalizacion(L))
            .catch(err => console.error(err));
    }

    private gestionarGeolocalizacion(L: any): void {
        const coordenadasFallback: [number, number] = [-17.3935, -66.157];

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (posicion) => {
                    const centro: [number, number] = [posicion.coords.latitude, posicion.coords.longitude];
                    this.construirMapa(L, centro, true);
                },
                () => this.construirMapa(L, coordenadasFallback, false)
            );
        } else {
            this.construirMapa(L, coordenadasFallback, false);
        }
    }

    private construirMapa(L: any, centro: [number, number], geolocalizado: boolean): void {
        this.map = L.map('map').setView([-16.2902, -63.5887], 5);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(this.map);

        this.map.flyTo(centro, 13, { animate: true, duration: 1.5 });

        if (geolocalizado) {
            L.circleMarker(centro, {
                radius: 8, fillColor: "#2563eb", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup('Tu ubicación actual').openPopup();
        }

        this.inicializarCapasAmenidades(L);
        this.consumirTerrenosJSON(L);
        this.consumirAmenidadesJSON(L);
    }

    private inicializarCapasAmenidades(L: any): void {
        this.capaHospitales = L.layerGroup();
        this.capaColegios = L.layerGroup();
        this.capaMercados = L.layerGroup();
        this.capaTransporte = L.layerGroup();
    }

    private consumirAmenidadesJSON(L: any): void {
        this.http.get<any[]>('/mock-data/amenidades.json').subscribe({
            next: (amenidades) => this.procesarAmenidades(amenidades, L),
            error: (err) => console.error(err)
        });
    }

    private procesarAmenidades(amenidades: any[], L: any): void {
        amenidades.forEach(amenidad => this.clasificarYDibujarAmenidad(amenidad, L));
    }

    private clasificarYDibujarAmenidad(amenidad: any, L: any): void {
        let emoji = '';
        let capaDestino = null;

        switch (amenidad.tipo) {
            case 'hospital':
                emoji = '🏥';
                capaDestino = this.capaHospitales;
                break;
            case 'colegio':
                emoji = '🏫';
                capaDestino = this.capaColegios;
                break;
            case 'mercado':
                emoji = '🛒';
                capaDestino = this.capaMercados;
                break;
            case 'transporte':
                emoji = '🚌';
                capaDestino = this.capaTransporte;
                break;
        }

        if (capaDestino) {
            this.crearMarcadorAmenidad(L, capaDestino, amenidad.coordenadas, emoji, amenidad.nombre);
        }
    }

    private crearMarcadorAmenidad(L: any, capa: any, coordenadas: [number, number], emoji: string, nombre: string): void {
        const icon = L.divIcon({
            className: 'amenidad-icon',
            html: `<div style="font-size: 18px; background: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); text-align: center; width: 26px; height: 26px; line-height: 18px;">${emoji}</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        const marker = L.marker(coordenadas, { icon }).bindTooltip(nombre);
        capa.addLayer(marker);
    }

    private consumirTerrenosJSON(L: any): void {
        this.http.get<any[]>('/mock-data/terrenos.json').subscribe({
            next: (terrenos) => this.procesarTerrenos(terrenos, L),
            error: (err) => console.error(err)
        });
    }

    private procesarTerrenos(terrenos: any[], L: any): void {
        terrenos.forEach(terreno => this.dibujarPoligono(terreno, L));
    }

    private dibujarPoligono(terreno: any, L: any): void {
        const areaTerreno = L.polygon(terreno.poligono, {
            className: 'poligono-terreno'
        }).addTo(this.map);

        this.agregarTooltipHTML(areaTerreno, terreno.ubicacion);
        this.configurarEventos(areaTerreno, terreno);
    }

    private agregarTooltipHTML(areaTerreno: any, ubicacion: string): void {
        const contenidoHTML = `
            <div style="font-family: sans-serif; text-align: center;">
                <strong>${ubicacion}</strong><br>
                <span style="font-size: 11px; color: #666;">Clic para ver detalles</span>
            </div>
        `;
        areaTerreno.bindTooltip(contenidoHTML, { direction: 'top', sticky: true });
    }

    private configurarEventos(areaTerreno: any, terreno: any): void {
        areaTerreno.on('click', () => {
            this.zone.run(() => {
                this.terrenoSeleccionado = terreno;
                this.cdr.detectChanges();
            });
            const centroPoligono = areaTerreno.getBounds().getCenter();
            this.map.flyTo(centroPoligono, 16, { 
                animate: true,
                duration: 1 
            });
        });
    }

    cerrarPanel(): void {
        this.terrenoSeleccionado = null;
    }
}