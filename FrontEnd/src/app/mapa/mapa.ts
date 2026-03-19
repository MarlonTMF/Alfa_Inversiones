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
    terrenoSeleccionado = signal<any>(null);
    private isAnimating: boolean = false;
    private map: any;
    private L: any;
    private capaTerrenos: any;
    private capaMercados: any;
    private capaTransporte: any;
    private capaColegios: any;
    private capaHospitales: any;
    public readonly amenidadesService = inject(AmenidadesService);

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
    
    ngOnDestroy(): void {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.iniciarLeaflet();
        }
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
        if (this.map) {
            this.map.remove();
        }
        this.map = L.map('map', {
            zoomControl: false 
        }).setView([-17.3895, -66.1568], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(this.map);
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);
        if (geolocalizado) {
            this.map.flyTo(centro, 13, { animate: true, duration: 1.5 });
            L.circleMarker(centro, {
                radius: 8, fillColor: "#2563eb", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup('Tu ubicación actual').openPopup();
        }
        this.inicializarCapasAmenidades(L);
        this.consumirAmenidadesJSON(L);        
        this.map.on('moveend', () => {
            if (!this.isAnimating) {
                this.obtenerTerrenosDelBackend();
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
        const maxLat = bounds.getNorth();
        const minLat = bounds.getSouth();
        const maxLng = bounds.getEast();
        const minLng = bounds.getWest();
        const url = `http://localhost:3000/api/v1/terrenos?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`;
        this.http.get<any[]>(url).subscribe({
            next: (terrenos) => {
                this.procesarTerrenos(terrenos);
            },
            error: (err) => console.error(err)
        });
    }

    private procesarTerrenos(terrenos: any[]): void {
        this.capaTerrenos.clearLayers();
        terrenos.forEach(terreno => this.dibujarPoligono(terreno, this.L));
    }

    private dibujarPoligono(terreno: any, L: any): void {
        const areaTerreno = L.polygon(terreno.poligono, {
            className: 'poligono-terreno',
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.4
        });
        this.capaTerrenos.addLayer(areaTerreno);

        const ubicacionTexto = terreno.ubicacion || terreno.codigo || 'Terreno Disponible';
        this.agregarTooltipHTML(areaTerreno, ubicacionTexto);
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
            this.terrenoSeleccionado.set(terreno);
            this.isAnimating = true;                
            const centroPoligono = areaTerreno.getBounds().getCenter();
            this.map.flyTo(centroPoligono, 16, { 
                animate: true,
                duration: 1 
            });
            this.map.once('moveend', () => {
                this.isAnimating = false;
            });
        });
    });
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
        let svgIcon = '';
        let capaDestino = null;
        let colorFondo = '';
        switch (amenidad.tipo) {
            case 'hospital': 
                svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`;
                colorFondo = '#ef4444';
                capaDestino = this.capaHospitales; 
                break;
            case 'colegio': 
                svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
                colorFondo = '#f59e0b';
                capaDestino = this.capaColegios; 
                break;
            case 'mercado': 
                svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
                colorFondo = '#10b981';
                capaDestino = this.capaMercados; 
                break;
            case 'transporte': 
                svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 21v-2"></path><path d="M16 21v-2"></path><path d="M4 11h16"></path><path d="M10 7h4"></path><path d="M8 15h.01"></path><path d="M16 15h.01"></path></svg>`;
                colorFondo = '#6366f1';
                capaDestino = this.capaTransporte; 
                break;
        }

        if (capaDestino) {
            this.crearMarcadorAmenidad(L, capaDestino, amenidad.coordenadas, svgIcon, colorFondo, amenidad.nombre);
        }
    }

    private crearMarcadorAmenidad(L: any, capa: any, coordenadas: [number, number], svgIcon: string, colorFondo: string, nombre: string): void {
        const icon = L.divIcon({
            className: 'marcador-transparente',
            html: `
                <div style="background-color: ${colorFondo}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.4); border: 2px solid white;">
                    ${svgIcon}
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const marker = L.marker(coordenadas, { icon }).bindTooltip(nombre);
        capa.addLayer(marker);
    }

    cerrarPanel(): void {
    this.terrenoSeleccionado.set(null);
    }
}