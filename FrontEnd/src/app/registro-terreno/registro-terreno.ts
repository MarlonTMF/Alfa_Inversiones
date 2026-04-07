import { Component, PLATFORM_ID, Inject, NgZone, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PropertyService } from '../services/property.service';
import { firstValueFrom } from 'rxjs';
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
    formularioPaso3: FormGroup;
    coordenadasSeleccionadas: string = '';
    
    // Variables de estado para el guardado
    estaCargando: boolean = false;
    mensajeEstado: string = '';
    
    categoriasDisponibles: string[] = ['Residencial', 'Comercial', 'Industrial', 'Uso Mixto', 'Agrícola'];

    private map: any;
    private L: any;
    private marker: any;

    documentos: { [key: string]: File | null } = {
        folioReal: null,
        certificadoCatastral: null,
        cedula: null,
        adicional: null
    };
    
    imagenes: File[] = [];
    imagenPrincipalIndex: number = 0;
    video: File | null = null;
    errorArchivo: string | null = null;

    constructor(
        private fb: FormBuilder,
        @Inject(PLATFORM_ID) private readonly platformId: Object,
        private readonly zone: NgZone,
        private readonly http: HttpClient,
        private readonly router: Router,
        private propertyService: PropertyService
    ) {
        this.formularioPaso2 = this.fb.group({
            categoria: ['', Validators.required],
            categoriaOtro: [''],
            ciudad: ['', Validators.required],
            distrito: [''],
            uv: [''],
            zona: [''],
            direccion: ['', Validators.required],
            coordenadas: ['', Validators.required],
            superficie: ['', Validators.required],
            frente: [''],
            fondo: [''],
            youtubeUrl: [''],
            precioBase: ['', Validators.required]
        });

        this.formularioPaso3 = this.fb.group({
            rol: ['propietario', Validators.required],
            nombrePropietario: ['', Validators.required],
            emailPropietario: ['', [Validators.required, Validators.email]],
            telefonoPropietario: ['', Validators.required],
            passwordGenerado: [{ value: this.generarPassword(), disabled: true }]
        });
    }

    ngOnDestroy(): void {
        this.destruirMapa();
    }

    generarPassword(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let pass = 'ALFA-';
        for (let i = 0; i < 5; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    regenerarPassword(): void {
        this.formularioPaso3.patchValue({ passwordGenerado: this.generarPassword() });
    }

    manejarArchivo(event: any, tipo: string): void {
        const file = event.target.files[0];
        if (file) this.procesarArchivo(file, tipo);
    }

    manejarImagenes(event: any): void {
        const files = event.target.files;
        this.errorArchivo = null;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                if (this.imagenes.length >= 10) {
                    this.errorArchivo = 'Máximo 10 imágenes permitidas.';
                    break;
                }
                const file = files[i];
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    this.errorArchivo = 'Solo se permiten imágenes JPG o PNG.';
                    continue;
                }
                if (file.size > 15 * 1024 * 1024) {
                    this.errorArchivo = 'Cada imagen debe pesar máximo 15MB.';
                    continue;
                }
                this.imagenes.push(file);
            }
        }
        // Limpiar el input para permitir volver a seleccionar el mismo archivo si fue eliminado
        event.target.value = null;
    }

    manejarVideo(event: any): void {
        const file = event.target.files[0];
        this.errorArchivo = null;
        if (file) {
            if (file.type !== 'video/mp4') {
                this.errorArchivo = 'Solo se permite video MP4.';
                return;
            }
            if (file.size > 100 * 1024 * 1024) {
                this.errorArchivo = 'El video supera el límite de 100MB.';
                return;
            }
            this.video = file;
        }
        event.target.value = null;
    }

    establecerPortada(index: number): void {
        this.imagenPrincipalIndex = index;
    }

    eliminarImagen(index: number): void {
        this.imagenes.splice(index, 1);
        if (this.imagenPrincipalIndex === index) {
            this.imagenPrincipalIndex = 0;
        } else if (this.imagenPrincipalIndex > index) {
            this.imagenPrincipalIndex--;
        }
    }

    eliminarVideo(): void {
        this.video = null;
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
        
        let tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
        let maxSize = 15 * 1024 * 1024;
        let mensajeErrorTipo = 'Solo se permiten formatos PDF, JPG y PNG.';

        if (tipo === 'adicional') {
            tiposPermitidos = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
            mensajeErrorTipo = 'Para documentos adicionales se permiten PDF o ZIP.';
        }
        
        if (!tiposPermitidos.includes(file.type)) {
            this.errorArchivo = mensajeErrorTipo;
            return;
        }
        
        if (file.size > maxSize) {
            this.errorArchivo = `El archivo supera el límite permitido.`;
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
            this.consolidarCategoria();
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
            this.consolidarCategoria();
            this.pasoActual = 3;
        }
    }

    consolidarCategoria(): void {
        const categoriaActual = this.formularioPaso2.get('categoria')?.value;
        const categoriaNueva = this.formularioPaso2.get('categoriaOtro')?.value;

        if (categoriaActual === 'Otro' && categoriaNueva && categoriaNueva.trim() !== '') {
            const nuevaNormalizada = categoriaNueva.trim();
            if (!this.categoriasDisponibles.includes(nuevaNormalizada)) {
                this.categoriasDisponibles.push(nuevaNormalizada);
            }
            this.formularioPaso2.patchValue({
                categoria: nuevaNormalizada,
                categoriaOtro: ''
            });
        }
    }

    formatearPrecio(event: any): void {
        let valor = event.target.value.replace(/\D/g, "");
        if (valor) {
            valor = Number.parseInt(valor, 10).toLocaleString('en-US'); 
            this.formularioPaso2.patchValue({ precioBase: valor });
        }
    }

    async finalizarRegistro(): Promise<void> {
        if (!this.formularioPaso2.valid || !this.formularioPaso3.valid || !this.esValidoPaso1()) {
            alert('Por favor, complete todos los pasos correctamente.');
            return;
        }

        this.estaCargando = true;
        this.mensajeEstado = 'Creando registro de la propiedad...';
        
        try {
            // 1. Preparar DTO de creación de propiedad
            // Generamos UUID para la propiedad o si el backend lo genera dejamos vacío:
            // Según el use-case de creación, el endpoint de backend (/properties) puede requerirlo si no se manda, 
            // pero el DTO `CreatePropertyDto` tiene `id` como obligatorio (@IsNotEmpty @IsUUID). 
            // Generaremos un UUID v4 en el frontend.
            const propertyId = crypto.randomUUID();

            const coordSplit = this.coordenadasSeleccionadas.split(',');
            const lat = parseFloat(coordSplit[0]);
            const lng = parseFloat(coordSplit[1]);

            // Obtener precio base y limpiar comas
            let precioStr = this.formularioPaso2.get('precioBase')?.value || '';
            const precioBase = Number.parseInt(precioStr.replace(/,/g, ''), 10) || 0;

            const newPropertyDto = {
                id: propertyId,
                category: this.formularioPaso2.get('categoria')?.value,
                city: this.formularioPaso2.get('ciudad')?.value,
                district: this.formularioPaso2.get('distrito')?.value,
                uv: this.formularioPaso2.get('uv')?.value,
                zoneBarrio: this.formularioPaso2.get('zona')?.value,
                exactAddress: this.formularioPaso2.get('direccion')?.value,
                lat: lat,
                lng: lng,
                totalArea: Number.parseFloat(this.formularioPaso2.get('superficie')?.value) || 0,
                frontM: Number.parseFloat(this.formularioPaso2.get('frente')?.value) || 0,
                backM: Number.parseFloat(this.formularioPaso2.get('fondo')?.value) || 0,
                basePriceNegotiation: precioBase,
                // Puedes mandar los datos del formulario 3 (del propietario) si tu backend lo aceptase
                // provisionalmente mandaremos lo básico requerido
            };

            // 2. Mandamos la propiedad al backend
            await firstValueFrom(this.propertyService.createProperty(newPropertyDto));
            
            // 3. Subir los documentos legales uno a uno
            const tipos = ['folioReal', 'certificadoCatastral', 'cedula', 'adicional'];
            let nroArchivo = 1;
            let totalArchivos = tipos.filter(t => this.documentos[t]).length + this.imagenes.length + (this.video ? 1 : 0);
            
            for (const tipo of tipos) {
                const file = this.documentos[tipo];
                if (file) {
                    this.mensajeEstado = `Subiendo documento legal... (${tipo})`;
                    await firstValueFrom(this.propertyService.uploadMultimedia(propertyId, file));
                    nroArchivo++;
                }
            }

            // 4. Subir Imágenes Múltiples y Asignar Portada
            for (let i = 0; i < this.imagenes.length; i++) {
                const imgFile = this.imagenes[i];
                this.mensajeEstado = `Subiendo imagen ${i + 1} de ${this.imagenes.length}...`;
                const uploadRes = await firstValueFrom(this.propertyService.uploadMultimedia(propertyId, imgFile));
                
                // Si esta imagen es la seleccionada como principal, marcamos en el backend
                // uploadRes debe contener los datos devueltos por el servidor donde esté el fileId
                // El backend devuelve { mensaje: "...", data: { id: "xxx", ... } } de acuerdo al controlador
                if (i === this.imagenPrincipalIndex && uploadRes?.data?.id) {
                    await firstValueFrom(this.propertyService.setMainMultimedia(propertyId, uploadRes.data.id));
                }
                nroArchivo++;
            }

            // 5. Subir Video (si existe)
            if (this.video) {
                this.mensajeEstado = `Subiendo video recorrido (puede tardar unos minutos)...`;
                await firstValueFrom(this.propertyService.uploadMultimedia(propertyId, this.video));
                nroArchivo++;
            }

            // 6. Todo listo
            this.mensajeEstado = '¡Propiedad y archivos subidos con éxito!';
            setTimeout(() => {
                this.estaCargando = false;
                this.router.navigate(['/mapa']);
            }, 1500);

        } catch (error) {
            console.error('Error al subir propiedad:', error);
            this.estaCargando = false;
            alert('Se produjo un error al registrar la propiedad. Por favor intente de nuevo.');
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
                     centro = [parseFloat(partes[0]), parseFloat(partes[1])];
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

                this.marker.on('dragend', this.manejarArrastreMarcador.bind(this));
                this.map.on('click', this.manejarClicMapa.bind(this));

                setTimeout(() => {
                    this.map.invalidateSize();
                }, 300);
            });
        }).catch(err => console.error(err));
    }

    private manejarArrastreMarcador(): void {
        const position = this.marker.getLatLng();
        this.zone.run(() => {
            this.actualizarCoordenadas(position.lat, position.lng);
        });
    }

    private manejarClicMapa(e: any): void {
        this.marker.setLatLng(e.latlng);
        this.zone.run(() => {
            this.actualizarCoordenadas(e.latlng.lat, e.latlng.lng);
        });
    }

    private actualizarCoordenadas(lat: number, lng: number): void {
        this.coordenadasSeleccionadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        this.formularioPaso2.patchValue({ coordenadas: this.coordenadasSeleccionadas });

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        this.http.get<any>(url).subscribe({
            next: (data) => {
                if (data?.address) {
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