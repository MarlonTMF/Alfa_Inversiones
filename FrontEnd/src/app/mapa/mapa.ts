import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone, effect, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AmenidadesService } from '../services/amenidades';
import { ExploradorService } from '../services/explorador';
import { TerrenoDetalle } from './terreno-detalle/terreno-detalle';

@Component({
    selector: 'app-mapa',
    standalone: true,
    imports: [CommonModule, TerrenoDetalle],
    templateUrl: './mapa.html',
    styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit, OnDestroy {
    private isAnimating: boolean = false;
    private map: any;
    private L: any;
    private capaTerrenos: any;
    private capaMercados: any;
    private capaTransporte: any;
    private capaColegios: any;
    private capaHospitales: any;
    
    public readonly amenidadesService = inject(AmenidadesService);
    public readonly exploradorService = inject(ExploradorService);
    
    private readonly amenidadesCache = new Map<string, { elements: any[], centro: [number, number] }>();

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly http: HttpClient,
        private readonly zone: NgZone,
        private readonly cdr: ChangeDetectorRef
    ) {
        effect(() => {
            if (!this.map) return;
            
            this.amenidadesService.mostrarHospitales();
            this.amenidadesService.mostrarColegios();
            this.amenidadesService.mostrarMercados();
            this.amenidadesService.mostrarTransporte();

            this.zone.runOutsideAngular(() => {
                this.actualizarCapasAmenidades();
            });
        });

        effect(() => {
            const terreno = this.exploradorService.terrenoSeleccionado();
            if (terreno && this.map && !this.isAnimating) {
                this.iniciarVueloHaciaTerreno(terreno);
            }
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

    private iniciarVueloHaciaTerreno(terreno: any): void {
        const centro = this.getCentroPoligono(terreno.poligono);
        this.isAnimating = true;
        
        this.zone.runOutsideAngular(() => {
            this.map.flyTo(centro, 17, { animate: true, duration: 1.5 });
            this.map.once('moveend', this.finalizarVuelo.bind(this));
        });
    }

    private finalizarVuelo(): void {
        this.zone.run(() => {
            this.isAnimating = false;
            this.actualizarVisibilidadTerrenos();
            this.cdr.detectChanges();
        });
    }

    private manejarMovimientoMapa(): void {
        this.zone.run(() => {
            this.actualizarVisibilidadTerrenos();
            if (!this.isAnimating) {
                this.actualizarCapasAmenidades();
            }
        });
    }

    private procesarTerrenos(terrenos: any[]): void {
        if (!this.map || !this.capaTerrenos) return;
        this.capaTerrenos.clearLayers();

        this.exploradorService.actualizarTerrenos(terrenos);
        
        terrenos.forEach(terreno => this.dibujarPoligono(terreno, this.L));
        this.actualizarVisibilidadTerrenos();
    }

    private actualizarVisibilidadTerrenos(): void {
        if (!this.map) return;
        const bounds = this.map.getBounds();
        const visibles = new Set<string>();

        this.exploradorService.todosLosTerrenos().forEach(t => {
            const centro = this.getCentroPoligono(t.poligono);
            if (bounds.contains(centro)) {
                visibles.add(t.id);
            }
        });

        this.exploradorService.actualizarVisibles(visibles);
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
        const coordenadasFallback: [number, number] = [-17.7612, -63.1921];
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
        if (isPlatformBrowser(this.platformId)) {
            const container = document.getElementById('map');
            if (container && (container as any)._leaflet_id) {
                (container as any)._leaflet_id = null;
            }
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
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(this.map);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        if (geolocalizado) {
            L.circleMarker(centro, {
                radius: 8, fillColor: "#2563eb", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup('Tu ubicación actual');
        }

        this.inicializarCapasAmenidades(L);

        this.map.on('moveend', this.manejarMovimientoMapa.bind(this));

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
        const url = `http://localhost:3000/api/v1/terrenos`;

        this.http.get<any[]>(url).subscribe({
            next: (terrenos) => this.procesarTerrenos(terrenos),
            error: (err) => console.error(err)
        });
    }

    private dibujarPoligono(terreno: any, L: any): void {
        const centro = this.getCentroPoligono(terreno.poligono);

        const marcadorInversion = L.circleMarker(centro, {
            radius: 9,
            fillColor: '#2563eb',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 1,
            className: 'marcador-precision-premium'
        });

        const areaInteractiva = L.polygon(terreno.poligono, {
            color: 'transparent',
            fillColor: 'transparent',
            weight: 0
        });

        this.capaTerrenos.addLayer(areaInteractiva);
        this.capaTerrenos.addLayer(marcadorInversion);

        marcadorInversion.bindTooltip(`<strong>${terreno.ubicacion || 'Inversión'}</strong>`, { direction: 'top', sticky: true });

        const manejarClick = () => {
            this.zone.run(() => {
                this.exploradorService.seleccionarTerreno(terreno);
                this.cdr.detectChanges();
            });
        };

        marcadorInversion.on('click', manejarClick);
        areaInteractiva.on('click', manejarClick);
    }

    private actualizarCapasAmenidades(): void {
        if (!this.map) return;

        const centroActual = [this.map.getCenter().lat, this.map.getCenter().lng] as [number, number];

        const filtros = [
            { activo: this.amenidadesService.mostrarHospitales(), tipo: 'salud', capa: this.capaHospitales },
            { activo: this.amenidadesService.mostrarColegios(), tipo: 'educacion', capa: this.capaColegios },
            { activo: this.amenidadesService.mostrarMercados(), tipo: 'comercio', capa: this.capaMercados },
            { activo: this.amenidadesService.mostrarTransporte(), tipo: 'transporte', capa: this.capaTransporte }
        ];

        filtros.forEach(f => {
            if (f.activo) {
                if (!this.map.hasLayer(f.capa)) {
                    this.map.addLayer(f.capa);
                }

                const cache = this.amenidadesCache.get(f.tipo);
                const distancia = cache ? this.calcularDistancia(centroActual, cache.centro) : Infinity;

                if (!cache || distancia > 800) {
                    this.amenidadesService.obtenerAmenidades(f.tipo, centroActual[0], centroActual[1]).subscribe({
                        next: (elementos) => {
                            this.amenidadesCache.set(f.tipo, { elements: elementos, centro: centroActual });
                            this.renderizarDesdeCache(f.tipo, f.capa, elementos);
                            this.amenidadesService.finalizarCarga(true);
                        },
                        error: () => {
                            f.capa.clearLayers();
                            this.amenidadesService.finalizarCarga(false);
                        }
                    });
                } else if (f.capa.getLayers().length === 0) {
                    this.renderizarDesdeCache(f.tipo, f.capa, cache.elements);
                }
            } else if (this.map.hasLayer(f.capa)) {
                this.map.removeLayer(f.capa);
                f.capa.clearLayers();
            }
        });
    }

    private renderizarDesdeCache(tipo: string, capa: any, elementos: any[]): void {
        capa.clearLayers();
        elementos.forEach((el: any) => {
            const tags = el.tags || {};
            const nombre = tags.name || tags.operator || tags.brand || (tipo.charAt(0).toUpperCase() + tipo.slice(1));
            const lat = el.lat || el.center?.lat;
            const lon = el.lon || el.center?.lon;
            if (lat && lon) {
                const icon = this.crearIconoPremium(tipo);
                const marker = this.L.marker([lat, lon], { icon }).bindTooltip(nombre);
                capa.addLayer(marker);
            }
        });
    }

    private calcularDistancia(p1: [number, number], p2: [number, number]): number {
        const R = 6371e3;
        const φ1 = p1[0] * Math.PI / 180;
        const φ2 = p2[0] * Math.PI / 180;
        const Δφ = (p2[0] - p1[0]) * Math.PI / 180;
        const Δλ = (p2[1] - p1[1]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private crearIconoPremium(tipo: string): any {
        const configs: any = {
            salud: { color: '#ef4444', icon: '🏥' },
            educacion: { color: '#f59e0b', icon: '🎓' },
            comercio: { color: '#10b981', icon: '🛒' },
            transporte: { color: '#3b82f6', icon: '🚌' }
        };
        const config = configs[tipo] || { color: '#333', icon: '' };

        return this.L.divIcon({
            className: 'marcador-premium-osm',
            html: `<div style="background: ${config.color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 16px; transition: transform 0.2s;">${config.icon}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    cerrarPanel(): void {
        this.exploradorService.seleccionarTerreno(null);
    }
}