import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone, effect, inject, ChangeDetectorRef, signal } from '@angular/core';
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
export class Mapa implements AfterViewInit, OnDestroy {
    terrenoSeleccionado: any = null;
    terrenosCercanos: any[] = []; // Para el panel de exploración
    private isAnimating: boolean = false;
    private map: any;
    private L: any;
    private capaTerrenos: any;
    private capaMercados: any;
    private capaTransporte: any;
    private capaColegios: any;
    private capaHospitales: any;
    public readonly amenidadesService = inject(AmenidadesService);
    private mapReady = signal(false);

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly http: HttpClient,
        private readonly zone: NgZone,
        private readonly cdr: ChangeDetectorRef
    ) {
        // Efecto reactivo para filtros de amenidades
        effect(() => {
            if (!this.mapReady()) return;

            // Reaccionamos a cualquier cambio en los filtros
            this.amenidadesService.mostrarHospitales();
            this.amenidadesService.mostrarColegios();
            this.amenidadesService.mostrarMercados();
            this.amenidadesService.mostrarTransporte();

            // Sincronizamos capas y cargamos datos reales
            this.zone.run(() => {
                this.actualizarCapasAmenidades();
            });
        });
    }

    ngOnDestroy(): void {
        this.limpiarMapa();
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.iniciarLeaflet();
        }
    }

    private procesarTerrenos(terrenos: any[]): void {
        if (!this.map || !this.capaTerrenos) return;
        this.capaTerrenos.clearLayers();
        this.terrenosCercanos = terrenos;
        terrenos.forEach(terreno => this.dibujarPoligono(terreno, this.L));
    }

    seleccionarTerrenoDesdeLista(terreno: any): void {
        this.terrenoSeleccionado = terreno;
        this.isAnimating = true;

        const centro = this.getCentroPoligono(terreno.poligono);
        this.map.flyTo(centro, 16, { animate: true, duration: 1.5 });

        this.map.once('moveend', () => {
            this.isAnimating = false;
        });
    }

    private getCentroPoligono(coords: [number, number][]): [number, number] {
        if (!coords || coords.length === 0) return [-17.7612, -63.1921];
        let latSum = 0, lngSum = 0;
        coords.forEach(c => { latSum += c[0]; lngSum += c[1]; });
        return [latSum / coords.length, lngSum / coords.length];
    }

    private iniciarLeaflet(): void {
        import('leaflet')
            .then((L) => {
                this.L = L;
                this.gestionarGeolocalizacion(L);
            })
            .catch(err => console.error(err));
    }

    private gestionarGeolocalizacion(L: any): void {
        const coordenadasFallback: [number, number] = [-17.7612, -63.1921]; // Equipetrol
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

    private limpiarMapa(): void {
        if (this.map) {
            this.map.off();
            this.map.remove();
            this.map = null;
        }
        const container = document.getElementById('map');
        if (container && (container as any)._leaflet_id) {
            (container as any)._leaflet_id = null;
        }
    }

    private construirMapa(L: any, centro: [number, number], geolocalizado: boolean): void {
        this.limpiarMapa();

        this.map = L.map('map', {
            zoomControl: false,
            center: centro,
            zoom: 15
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; CARTO'
        }).addTo(this.map);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        if (geolocalizado) {
            L.circleMarker(centro, {
                radius: 8, fillColor: "#2563eb", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup('Tu ubicación actual');
        }

        this.inicializarCapasAmenidades(L);
        this.mapReady.set(true);

        this.map.on('moveend', () => {
            if (!this.isAnimating) {
                this.obtenerTerrenosDelBackend();
                this.actualizarCapasAmenidades();
            }
        });

        this.obtenerTerrenosDelBackend();
    }

    private inicializarCapasAmenidades(L: any): void {
        this.capaHospitales = L.layerGroup();
        this.capaColegios = L.layerGroup();
        this.capaMercados = L.layerGroup();
        this.capaTransporte = L.layerGroup();
        this.capaTerrenos = L.layerGroup().addTo(this.map);
    }

    private obtenerTerrenosDelBackend(): void {
        if (!this.map) return;
        const bounds = this.map.getBounds();
        const url = `http://localhost:3000/api/v1/terrenos?minLat=${bounds.getSouth()}&maxLat=${bounds.getNorth()}&minLng=${bounds.getWest()}&maxLng=${bounds.getEast()}`;

        this.http.get<any[]>(url).subscribe({
            next: (terrenos) => this.procesarTerrenos(terrenos),
            error: (err) => console.error('Error Backend Terrenos:', err)
        });
    }

    private dibujarPoligono(terreno: any, L: any): void {
        // El Backend ya devuelve [lat, lng]. NO invertir.
        const areaTerreno = L.polygon(terreno.poligono, {
            className: 'poligono-terreno',
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.4
        });
        this.capaTerrenos.addLayer(areaTerreno);

        areaTerreno.bindTooltip(`<strong>${terreno.ubicacion || 'Terreno'}</strong>`, { direction: 'top', sticky: true });

        areaTerreno.on('click', () => {
            this.zone.run(() => {
                this.terrenoSeleccionado = terreno;
                this.cdr.detectChanges();
                this.isAnimating = true;
                this.map.flyTo(areaTerreno.getBounds().getCenter(), 16, { animate: true, duration: 1.5 });
                this.map.once('moveend', () => { this.isAnimating = false; });
            });
        });
    }

    private actualizarCapasAmenidades(): void {
        const filtros = [
            { activo: this.amenidadesService.mostrarHospitales(), tipo: 'hospital', capa: this.capaHospitales },
            { activo: this.amenidadesService.mostrarColegios(), tipo: 'colegio', capa: this.capaColegios },
            { activo: this.amenidadesService.mostrarMercados(), tipo: 'mercado', capa: this.capaMercados },
            { activo: this.amenidadesService.mostrarTransporte(), tipo: 'transporte', capa: this.capaTransporte }
        ];

        filtros.forEach(f => {
            if (f.activo) {
                if (!this.map.hasLayer(f.capa)) this.map.addLayer(f.capa);
                this.cargarAmenidadesDelBackend(f.tipo, f.capa);
            } else {
                if (this.map.hasLayer(f.capa)) this.map.removeLayer(f.capa);
                f.capa.clearLayers();
            }
        });
    }

    private cargarAmenidadesDelBackend(tipo: string, capa: any): void {
        const centro = this.map.getCenter();
        const url = `http://localhost:3000/api/v1/amenidades?tipo=${tipo}&lat=${centro.lat}&lng=${centro.lng}&radio=3000`;

        this.http.get<any[]>(url).subscribe({
            next: (amenidades) => {
                capa.clearLayers();
                amenidades.forEach(a => {
                    const icon = this.crearIconoColoreado(a.tipo);
                    const marker = this.L.marker([a.lat, a.lng], { icon }).bindTooltip(a.nombre);
                    capa.addLayer(marker);
                });
            },
            error: (err) => console.error(`Error Amenidades ${tipo}:`, err)
        });
    }

    private crearIconoColoreado(tipo: string): any {
        const colores: any = { hospital: '#ef4444', colegio: '#f59e0b', mercado: '#10b981', transporte: '#6366f1' };
        return this.L.divIcon({
            className: 'marcador-custom',
            html: `<div style="background: ${colores[tipo] || '#333'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    cerrarPanel(): void { this.terrenoSeleccionado = null; }
}
