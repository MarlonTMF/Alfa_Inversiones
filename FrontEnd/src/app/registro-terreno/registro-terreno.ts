import { Component, PLATFORM_ID, Inject, NgZone, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-registro-terreno',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './registro-terreno.html',
    styleUrl: './registro-terreno.css'
})
export class RegistroTerreno implements OnDestroy {
    pasoActual: number = 1;
    formularioPaso2: FormGroup;
    coordenadasSeleccionadas: string = '';
    
    private map: any;
    private L: any;
    private marker: any;

    documentos: { [key: string]: File | null } = {
        folioReal: null,
        certificadoCatastral: null,
        cedula: null,
        planos: null,
        multimedia: null
    };
    errorArchivo: string | null = null;

    constructor(
        private readonly fb: FormBuilder,
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly zone: NgZone,
        private readonly http: HttpClient
    ) {
        this.formularioPaso2 = this.fb.group({
            ciudad: ['Cochabamba'],
            distrito: [''],
            uv: [''],
            zona: [''],
            direccion: ['', Validators.required],
            coordenadas: ['', Validators.required],
            superficie: ['', Validators.required],
            frente: [''],
            fondo: [''],
            youtubeUrl: [''], // <-- Nuevo campo para el link
            precioBase: ['', Validators.required]
        });
    }

    ngOnDestroy(): void {
        this.destruirMapa();
    }

    manejarArchivo(event: any, tipo: string): void {
        const file = event.target.files[0];
        if (file) this.procesarArchivo(file, tipo);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent, tipo: string): void {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer?.files[0];
        if (file) this.procesarArchivo(file, tipo);
    }

    private procesarArchivo(file: File, tipo: string): void {
        this.errorArchivo = null;
        
        // Configuración por defecto (Documentos Legales)
        let tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
        let maxSize = 15 * 1024 * 1024; // 15MB
        let mensajeErrorTipo = 'Solo se permiten formatos PDF, JPG y PNG.';

        // Configuración especial para Multimedia
        if (tipo === 'multimedia') {
            tiposPermitidos = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'audio/mp3'];
            maxSize = 50 * 1024 * 1024; // 50MB para videos
            mensajeErrorTipo = 'Para multimedia solo se permiten JPG, PNG, MP4 o MP3.';
        }
        
        if (!tiposPermitidos.includes(file.type) && !file.name.endsWith('.mp3')) { // fallback manual para mp3
            this.errorArchivo = mensajeErrorTipo;
            return;
        }
        
        if (file.size > maxSize) {
            this.errorArchivo = `El archivo supera el límite de ${maxSize / (1024 * 1024)}MB.`;
            return;
        }
        
        this.documentos[tipo] = file;
    }

    eliminarArchivo(tipo: string): void {
        this.documentos[tipo] = null;
    }

    esValidoPaso1(): boolean {
        return this.documentos['folioReal'] !== null && this.documentos['certificadoCatastral'] !== null;
    }

    pasoAnterior(): void {
        if (this.pasoActual > 1) {
            this.pasoActual--;
        }
    }

    siguientePaso(): void {
        if (this.pasoActual === 1 && this.esValidoPaso1()) {
            this.pasoActual = 2;
            this.activarMapa();
        } else if (this.pasoActual === 2 && this.formularioPaso2.valid) {
            this.pasoActual = 3;
        }
    }

    irAPaso(pasoDestino: number): void {
        if (pasoDestino === 1) {
            this.pasoActual = 1;
        } else if (pasoDestino === 2 && this.esValidoPaso1()) {
            this.pasoActual = 2;
            this.activarMapa();
        } else if (pasoDestino === 3 && this.esValidoPaso1() && this.formularioPaso2.valid) {
            this.pasoActual = 3;
        }
    }

    formatearPrecio(event: any): void {
        let valor = event.target.value.replaceAll(/\D/g, "");
        if (valor) {
            valor = Number.parseInt(valor, 10).toLocaleString('en-US'); 
            this.formularioPaso2.patchValue({ precioBase: valor });
        }
    }

    private activarMapa(): void {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                this.iniciarLeafletInline();
            }, 100);
        }
    }

    private iniciarLeafletInline(): void {
        if (this.map) {
            this.map.invalidateSize();
            return;
        }

        import('leaflet').then((L) => {
            this.L = L;
            let centro: [number, number] = [-17.3895, -66.1568];
            
            if (this.coordenadasSeleccionadas) {
                const partes = this.coordenadasSeleccionadas.split(',');
                if(partes.length === 2){
                    centro = [Number.parseFloat(partes[0]), Number.parseFloat(partes[1])];
                }
            }

            this.zone.runOutsideAngular(() => {
                this.map = L.map('mapa-inline-container', {
                    zoomControl: false 
                }).setView(centro, 15);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    attribution: '&copy; CARTO'
                }).addTo(this.map);
                
                L.control.zoom({ position: 'bottomright' }).addTo(this.map);

                const icon = L.divIcon({
                    className: 'marcador-transparente',
                    html: `
                        <div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.5);"></div>
                        <div style="width: 2px; height: 12px; background-color: #1e3a8a; margin: 0 auto;"></div>
                    `,
                    iconSize: [24, 36],
                    iconAnchor: [12, 36]
                });

                this.marker = L.marker(centro, { 
                    icon: icon,
                    draggable: true 
                }).addTo(this.map);

                this.actualizarCoordenadas(centro[0], centro[1]);

                this.marker.on('dragend', () => {
                    const position = this.marker.getLatLng();
                    this.zone.run(() => {
                        this.actualizarCoordenadas(position.lat, position.lng);
                    });
                });

                this.map.on('click', (e: any) => {
                    this.marker.setLatLng(e.latlng);
                    this.zone.run(() => {
                        this.actualizarCoordenadas(e.latlng.lat, e.latlng.lng);
                    });
                });

                setTimeout(() => {
                    this.map.invalidateSize();
                }, 300);
            });
        }).catch(err => console.error(err));
    }

    private actualizarCoordenadas(lat: number, lng: number): void {
        this.coordenadasSeleccionadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        this.formularioPaso2.patchValue({ coordenadas: this.coordenadasSeleccionadas });

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        this.http.get<any>(url).subscribe({
            next: (data) => {
                if (data && data.address) {
                    let direccionFinal = '';
                    const calle = data.address.road || data.address.pedestrian || '';
                    const numero = data.address.house_number || '';
                    const barrio = data.address.neighbourhood || data.address.suburb || '';

                    if (calle) {
                        direccionFinal = `Calle ${calle}`;
                        if (numero) direccionFinal += ` nro ${numero}`;
                        if (barrio) direccionFinal += `, ${barrio}`;
                    } else if (data.display_name) {
                        const partes = data.display_name.split(',');
                        direccionFinal = partes.slice(0, 2).join(',').trim();
                    }

                    if (direccionFinal) {
                        this.formularioPaso2.patchValue({ direccion: direccionFinal });
                    }
                }
            },
            error: () => {}
        });
    }

    obtenerUbicacionActual(): void {
        if (navigator.geolocation && this.map && this.marker) {
            navigator.geolocation.getCurrentPosition(
                (posicion) => {
                    const lat = posicion.coords.latitude;
                    const lng = posicion.coords.longitude;
                    this.zone.runOutsideAngular(() => {
                        this.map.flyTo([lat, lng], 16, { animate: true });
                        this.marker.setLatLng([lat, lng]);
                    });
                    this.actualizarCoordenadas(lat, lng);
                },
                () => {}
            );
        }
    }

    private destruirMapa(): void {
        if (this.map) {
            this.map.off();
            this.map.remove();
            this.map = null;
            this.marker = null;
        }
    }
}