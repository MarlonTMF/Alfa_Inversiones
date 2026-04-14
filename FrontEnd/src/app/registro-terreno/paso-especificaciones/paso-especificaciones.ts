import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-paso-especificaciones',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './paso-especificaciones.html'
})
export class PasoEspecificaciones implements OnInit, OnDestroy {
    @Input() formulario!: FormGroup;
    @Output() siguiente = new EventEmitter<void>();
    @Output() atras = new EventEmitter<void>();

    categoriasDisponibles: string[] = ['Residencial', 'Comercial', 'Industrial', 'Uso Mixto', 'Agrícola'];
    estadoMapaText: string = 'Haga clic para trazar el 1° punto del terreno';
    
    private map: any;
    private L: any;
    private puntosPoligono: any[] = [];
    private poligonoDibujado: any = null;
    private marcadores: any[] = [];
    private lineasTemp: any = null;
    private rubberband: any = null;
    private poligonoCerrado: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly zone: NgZone,
        private readonly http: HttpClient,
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => this.iniciarMapa(), 100);
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }

    consolidarCategoria(): void {
        const catAct = this.formulario.get('categoria')?.value;
        const catNueva = this.formulario.get('categoriaOtro')?.value;

        if (catAct === 'Otro' && catNueva && catNueva.trim() !== '') {
            const normalizada = catNueva.trim();
            if (!this.categoriasDisponibles.includes(normalizada)) {
                this.categoriasDisponibles.push(normalizada);
            }
            this.formulario.patchValue({ categoria: normalizada, categoriaOtro: '' });
        }
    }

    formatearPrecio(event: any): void {
        let valor = event.target.value.replace(/\D/g, "");
        if (valor) {
            valor = Number.parseInt(valor, 10).toLocaleString('en-US'); 
            this.formulario.patchValue({ precioBase: valor });
        }
    }

    limpiarTrazado(): void {
        this.puntosPoligono = [];
        this.poligonoCerrado = false;
        if (this.poligonoDibujado) { this.map.removeLayer(this.poligonoDibujado); this.poligonoDibujado = null; }
        if (this.lineasTemp) { this.map.removeLayer(this.lineasTemp); this.lineasTemp = null; }
        if (this.rubberband) { this.map.removeLayer(this.rubberband); this.rubberband = null; }
        this.marcadores.forEach(m => this.map.removeLayer(m));
        this.marcadores = [];
        
        this.formulario.patchValue({ coordenadas: '', superficie: '', frente: '', fondo: '' });
        this.estadoMapaText = 'Haga clic para trazar el 1° punto del terreno';
        this.cdr.detectChanges();
    }

    deshacerUltimoPunto(): void {
        if (this.poligonoCerrado) return;
        if (this.puntosPoligono.length > 0) {
            this.puntosPoligono.pop();
            const m = this.marcadores.pop();
            if (m) this.map.removeLayer(m);
            this.actualizarDibujo();
            
            if (this.puntosPoligono.length === 0) {
                this.estadoMapaText = 'Haga clic para trazar el 1° punto del terreno';
                this.formulario.patchValue({ coordenadas: '', superficie: '', frente: '', fondo: '' });
            } else if (this.puntosPoligono.length === 1) {
                this.estadoMapaText = 'Trace el 2° punto (Fin del Frente)';
                this.formulario.patchValue({ frente: '', fondo: '', superficie: '' });
            } else if (this.puntosPoligono.length >= 2) {
                this.estadoMapaText = 'Siga trazando el perímetro en orden';
            }
        }
    }

    private actualizarDibujo(): void {
        if (this.lineasTemp) { this.map.removeLayer(this.lineasTemp); this.lineasTemp = null; }
        if (this.rubberband) { this.map.removeLayer(this.rubberband); this.rubberband = null; }
        
        if (this.puntosPoligono.length > 1 && !this.poligonoCerrado) {
            this.lineasTemp = this.L.polyline(this.puntosPoligono, { color: '#3b82f6', weight: 3 }).addTo(this.map);
        }
    }

    private iniciarMapa(): void {
        import('leaflet').then((L) => {
            this.L = L;
            this.zone.runOutsideAngular(() => {
                this.map = L.map('mapa-inline-container', { zoomControl: false }).setView([-17.3895, -66.1568], 15);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19
                }).addTo(this.map);
                
                L.control.zoom({ position: 'bottomright' }).addTo(this.map);

                const coordsExistentes = this.formulario.get('coordenadas')?.value;
                if (coordsExistentes) {
                    try {
                        const geoJson = typeof coordsExistentes === 'string' ? JSON.parse(coordsExistentes) : coordsExistentes;
                        const ring = geoJson.coordinates[0];
                        const ringSinCerrar = ring.slice(0, -1);
                        this.puntosPoligono = ringSinCerrar.map((c: any) => this.L.latLng(c[1], c[0]));
                        this.poligonoCerrado = true;

                        this.puntosPoligono.forEach(pt => {
                            const m = this.L.circleMarker(pt, { radius: 5, fillColor: '#3b82f6', color: '#ffffff', weight: 2, opacity: 1, fillOpacity: 1 }).addTo(this.map);
                            this.marcadores.push(m);
                        });

                        this.poligonoDibujado = this.L.polygon(this.puntosPoligono, { color: '#3b82f6', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.3 }).addTo(this.map);
                        
                        setTimeout(() => {
                            if (this.poligonoDibujado) {
                                this.map.fitBounds(this.poligonoDibujado.getBounds(), { padding: [30, 30] });
                            }
                        }, 350);

                        this.estadoMapaText = `Área pre-cargada. Limpie para volver a trazar.`;
                    } catch(e) {}
                }

                this.map.on('click', (e: any) => this.manejarClicMapa(e));
                this.map.on('mousemove', (e: any) => this.manejarMovimientoMapa(e));
                
                setTimeout(() => this.map.invalidateSize(), 300);
            });
        }).catch(e => console.error(e));
    }

    private manejarMovimientoMapa(e: any): void {
        if (this.puntosPoligono.length > 0 && !this.poligonoCerrado) {
            this.zone.runOutsideAngular(() => {
                if (this.rubberband) {
                    this.map.removeLayer(this.rubberband);
                }
                const startPoint = this.puntosPoligono[this.puntosPoligono.length - 1];
                
                this.rubberband = this.L.polyline([startPoint, e.latlng], { 
                    color: '#60a5fa', 
                    dashArray: '5, 5', 
                    weight: 2 
                }).addTo(this.map);
            });
        }
    }

    private manejarClicMapa(e: any): void {
        if (this.poligonoCerrado) return;

        this.zone.run(() => {
            this.puntosPoligono.push(e.latlng);

            const marcador = this.L.circleMarker(e.latlng, {
                radius: 5, fillColor: '#3b82f6', color: '#ffffff', weight: 2, opacity: 1, fillOpacity: 1
            }).addTo(this.map);
            this.marcadores.push(marcador);

            this.actualizarDibujo();

            if (this.puntosPoligono.length === 1) {
                this.estadoMapaText = 'Trace el 2° punto (Fin del Frente)';
                this.hacerReverseGeocoding(e.latlng.lat, e.latlng.lng);
            } else if (this.puntosPoligono.length === 2) {
                this.estadoMapaText = 'Siga trazando el perímetro en orden';
                const distanciaFrente = this.puntosPoligono[0].distanceTo(this.puntosPoligono[1]);
                this.formulario.patchValue({ frente: distanciaFrente.toFixed(2) });
            } else if (this.puntosPoligono.length >= 3) {
                this.estadoMapaText = 'Haga doble clic o pulse "Cerrar Polígono" para terminar';
            }
            this.cdr.detectChanges();
        });
    }

    cerrarPoligono(): void {
        if (this.puntosPoligono.length < 3 || this.poligonoCerrado) return;
        
        this.poligonoCerrado = true;
        if (this.lineasTemp) { this.map.removeLayer(this.lineasTemp); this.lineasTemp = null; }
        if (this.rubberband) { this.map.removeLayer(this.rubberband); this.rubberband = null; }

        this.poligonoDibujado = this.L.polygon(this.puntosPoligono, {
            color: '#3b82f6', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.3
        }).addTo(this.map);

        const area = this.calcularArea(this.puntosPoligono);
        const frenteActual = parseFloat(this.formulario.get('frente')?.value || '0');
        const fondoAprox = frenteActual > 0 ? (area / frenteActual).toFixed(2) : '0';

        const geoJson = this.poligonoDibujado.toGeoJSON();
        this.formulario.patchValue({ 
            coordenadas: JSON.stringify(geoJson.geometry),
            superficie: area.toFixed(2),
            fondo: fondoAprox
        });
        
        this.estadoMapaText = `Área calculada: ${area.toFixed(2)} m².`;
        this.cdr.detectChanges();
    }

    private calcularArea(latlngs: any[]): number {
        let area = 0;
        const d2r = Math.PI / 180;
        if (latlngs.length > 2) {
            for (let i = 0; i < latlngs.length; i++) {
                let p1 = latlngs[i];
                let p2 = latlngs[(i + 1) % latlngs.length];
                area += (p2.lng - p1.lng) * d2r *
                        (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r)) *
                        Math.sin((p1.lat - p2.lat) * d2r / 2.0);
            }
            area = Math.abs(area * 6378137.0 * 6378137.0 / 2.0);
        }
        return area;
    }

    private hacerReverseGeocoding(lat: number, lng: number): void {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        this.http.get<any>(url).subscribe({
            next: (data) => {
                if (data?.address) {
                    let dir = '';
                    const calle = data.address.road || data.address.pedestrian || '';
                    const numero = data.address.house_number || '';
                    const barrio = data.address.neighbourhood || data.address.suburb || '';

                    if (calle) dir = `Calle ${calle} ${numero ? 'nro ' + numero : ''}${barrio ? ', ' + barrio : ''}`;
                    else if (data.display_name) dir = data.display_name.split(',').slice(0, 2).join(',').trim();

                    if (dir && !this.formulario.get('direccion')?.value) {
                        this.formulario.patchValue({ direccion: dir });
                    }
                    if ((data.address.city || data.address.town) && !this.formulario.get('ciudad')?.value) {
                        this.formulario.patchValue({ ciudad: data.address.city || data.address.town });
                    }
                    if (barrio && !this.formulario.get('zona')?.value) {
                        this.formulario.patchValue({ zona: barrio });
                    }
                }
            },
            error: () => {}
        });
    }
}