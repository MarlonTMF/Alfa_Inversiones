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
    todosLosTerrenos = signal<any[]>([]); // Lista completa de activos
    terrenosCercanos = signal<any[]>([]); // Lista filtrada/ordenada para la UI
    terrenosVisiblesIds = signal<Set<string>>(new Set()); // IDs de terrenos visibles en el mapa
    departamentoSeleccionado = signal<string>('Todos'); // Filtro de departamento

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
    private amenidadesCache = new Map<string, { elements: any[], centro: [number, number] }>();

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly http: HttpClient,
        private readonly zone: NgZone,
        private readonly cdr: ChangeDetectorRef
    ) {
        // Efecto reactivo para filtros de amenidades
        effect(() => {
            if (!this.mapReady()) return;

            // Leemos los signals para suscribir el efecto
            const h = this.amenidadesService.mostrarHospitales();
            const c = this.amenidadesService.mostrarColegios();
            const m = this.amenidadesService.mostrarMercados();
            const t = this.amenidadesService.mostrarTransporte();

            console.log('Filtros cambiados, actualizando capas de amenidades...');

            this.zone.run(() => {
                this.actualizarCapasAmenidades();
            });
        });

        // Efecto para actualizar la lista filtrada cuando cambian los terrenos, el filtro o la visibilidad
        effect(() => {
            const todos = this.todosLosTerrenos();
            const filtro = this.departamentoSeleccionado();
            const visibles = this.terrenosVisiblesIds();

            let filtrados = todos;
            if (filtro !== 'Todos') {
                filtrados = todos.filter(t => t.departamento === filtro);
            }

            // Ordenamos: primero los que están visibles en el mapa
            const ordenados = [...filtrados].sort((a, b) => {
                const aVisible = visibles.has(a.id);
                const bVisible = visibles.has(b.id);
                if (aVisible && !bVisible) return -1;
                if (!aVisible && bVisible) return 1;
                return 0;
            });

            this.zone.run(() => {
                this.terrenosCercanos.set(ordenados);
                this.cdr.detectChanges();
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

        // Actualizamos la lista completa
        this.zone.run(() => {
            this.todosLosTerrenos.set(terrenos);
            this.actualizarVisibilidadTerrenos();
        });

        terrenos.forEach(terreno => this.dibujarPoligono(terreno, this.L));
    }

    private actualizarVisibilidadTerrenos(): void {
        if (!this.map) return;
        const bounds = this.map.getBounds();
        const visibles = new Set<string>();

        this.todosLosTerrenos().forEach(t => {
            const centro = this.getCentroPoligono(t.poligono);
            if (bounds.contains(centro)) {
                visibles.add(t.id);
            }
        });

        this.terrenosVisiblesIds.set(visibles);
    }

    seleccionarTerrenoDesdeLista(terreno: any): void {
        this.terrenoSeleccionado = terreno;
        this.isAnimating = true;

        const centro = this.getCentroPoligono(terreno.poligono);
        this.map.flyTo(centro, 16, { animate: true, duration: 1.5 });

        this.map.once('moveend', () => {
            this.isAnimating = false;
            this.actualizarVisibilidadTerrenos();
        });
    }

    cambiarFiltroDepartamento(event: any): void {
        const dpto = event.target.value;
        this.departamentoSeleccionado.set(dpto);
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

        // Usamos OpenStreetMap estándar para mayor detalle y color (como en la referencia)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        if (geolocalizado) {
            L.circleMarker(centro, {
                radius: 8, fillColor: "#2563eb", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup('Tu ubicación actual');
        }

        this.inicializarCapasAmenidades(L);
        this.mapReady.set(true);

        // Los eventos de Leaflet deben correr en NgZone para avisar a Angular
        this.map.on('moveend', () => {
            this.zone.run(() => {
                this.actualizarVisibilidadTerrenos();
                if (!this.isAnimating) {
                    this.actualizarCapasAmenidades();
                }
            });
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
        // Petición global sin bounds para tener todos los activos inicialmente
        const url = `http://localhost:3000/api/v1/terrenos`;

        this.http.get<any[]>(url).subscribe({
            next: (terrenos) => this.procesarTerrenos(terrenos),
            error: (err) => console.error('Error Backend Terrenos:', err)
        });
    }

    private dibujarPoligono(terreno: any, L: any): void {
        const centro = this.getCentroPoligono(terreno.poligono);

        // SOLO dibujo el marcador de precisión (Punto Azul con borde negro/sombra)
        // Esto soluciona el problema de los "cuadrados grandes"
        const marcadorInversion = L.circleMarker(centro, {
            radius: 9,
            fillColor: '#2563eb',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 1,
            className: 'marcador-precision-premium'
        });

        // El polígono se usa solo como una capa invisible para mejorar el área de interacción si fuera necesario,
        // pero para cumplir con la estética del usuario, no le pondremos color.
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
                this.terrenoSeleccionado = terreno;
                this.cdr.detectChanges();
                this.isAnimating = true;
                this.map.flyTo(centro, 17, { animate: true, duration: 1.5 });
                this.map.once('moveend', () => { this.isAnimating = false; });
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
                    console.log(`Capa ${f.tipo} activada.`);
                }

                // Lógica de Caché Inteligente:
                const cache = this.amenidadesCache.get(f.tipo);
                const distancia = cache ? this.calcularDistancia(centroActual, cache.centro) : Infinity;

                // Solo consultamos si NO hay caché O si el usuario se ha movido más de 800 metros
                if (!cache || distancia > 800) {
                    console.log(`Buscando ${f.tipo} en red (Distancia desplazada: ${distancia.toFixed(0)}m)...`);
                    this.cargarAmenidadesDesdeOSM(f.tipo, f.capa, centroActual);
                } else if (f.capa.getLayers().length === 0) {
                    // Si hay caché pero la capa está vacía (por haberla desactivado antes), restauramos desde caché
                    console.log(`Restaurando ${f.tipo} desde caché local.`);
                    this.renderizarDesdeCache(f.tipo, f.capa, cache.elements);
                }
            } else {
                if (this.map.hasLayer(f.capa)) {
                    this.map.removeLayer(f.capa);
                    f.capa.clearLayers();
                    console.log(`Capa ${f.tipo} oculta.`);
                }
            }
        });
    }

    private cargarAmenidadesDesdeOSM(tipo: string, capa: any, centroActual: [number, number]): void {
        const bounds = this.map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        // Evitar peticiones si el zoom es muy bajo para no saturar Overpass
        if (this.map.getZoom() < 13) {
            console.warn(`Zoom demasiado bajo para ${tipo}.`);
            return;
        }

        const categoryTags: any = {
            salud: '["amenity"~"hospital|clinic|doctors|pharmacy"]',
            educacion: '["amenity"~"school|college|university|kindergarten"]',
            comercio: '["shop"~"supermarket|convenience|marketplace|mall|department_store"]',
            transporte: '["highway"~"bus_stop"]["bus"="yes"]'
        };

        const tagQuery = categoryTags[tipo] || '["amenity"~"hospital|school"]';
        const bbox = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;
        let query = `[out:json][timeout:25];(node${tagQuery}(${bbox});way${tagQuery}(${bbox}););out center;`;

        if (tipo === 'transporte') {
            query = `[out:json][timeout:25];(node["highway"="bus_stop"](${bbox});node["amenity"="bus_station"](${bbox});way["amenity"="bus_station"](${bbox}););out center;`;
        }

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        this.amenidadesService.iniciarCarga();
        this.http.get<any>(url).subscribe({
            next: (data) => {
                if (data && data.elements) {
                    // Guardamos en caché
                    this.amenidadesCache.set(tipo, { elements: data.elements, centro: centroActual });
                    this.renderizarDesdeCache(tipo, capa, data.elements);
                    console.log(`OSM exitoso: ${data.elements.length} ${tipo} cargados.`);
                } else {
                    console.log(`OSM: No se encontraron resultados para ${tipo} en esta zona.`);
                    capa.clearLayers();
                }
                this.amenidadesService.finalizarCarga();
            },
            error: (err) => {
                console.error(`Error Overpass OSM ${tipo}:`, err);
                // Si hay error, al menos limpiamos para que no se vea info vieja/falsa
                capa.clearLayers();
                this.amenidadesService.finalizarCarga();
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
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = p1[0] * Math.PI / 180;
        const φ2 = p2[0] * Math.PI / 180;
        const Δφ = (p2[0] - p1[0]) * Math.PI / 180;
        const Δλ = (p2[1] - p1[1]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distancia en metros
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

    private crearIconoColoreado(tipo: string): any {
        // Mantenido por compatibilidad si se usa en otros lugares, pero crearIconoPremium es el nuevo estándar
        return this.crearIconoPremium(tipo);
    }

    cerrarPanel(): void { this.terrenoSeleccionado = null; }
}
