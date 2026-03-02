import { Component, AfterViewInit, PLATFORM_ID, Inject, EnvironmentInjector, createComponent, ApplicationRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TerrenoPopup } from '../terreno-popup/terreno-popup'; // Importa tu nuevo componente

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit {
  private map: any;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly http: HttpClient,
    // Inyectamos las herramientas de Angular para crear componentes al vuelo
    private injector: EnvironmentInjector,
    private appRef: ApplicationRef
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarMapaYGeolocalizacion();
    }
  }

  private cargarMapaYGeolocalizacion(): void {
    import('leaflet').then((L) => {
      const coordenadasFallback: [number, number] = [-17.3935, -66.157];
      this.map = L.map('map').setView([-16.2902, -63.5887], 5);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (posicion) => {
            const lat = posicion.coords.latitude;
            const lng = posicion.coords.longitude;
            this.map.flyTo([lat, lng], 13, { animate: true, duration: 1.5 });
            
            L.circleMarker([lat, lng], {
              radius: 8, fillColor: "#2563eb", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.8
            }).addTo(this.map).bindPopup('Tu ubicación actual').openPopup();

            this.consumirJSON(L);
          },
          (error) => {
            console.warn('Geolocalización denegada. Usando fallback.', error);
            this.map.flyTo(coordenadasFallback, 13);
            this.consumirJSON(L);
          }
        );
      } else {
        this.map.flyTo(coordenadasFallback, 13);
        this.consumirJSON(L);
      }
    }).catch(err => console.error("Error cargando Leaflet", err));
  }

  private consumirJSON(L: any): void {
    this.http.get<any[]>('/mock-data/terrenos.json').subscribe({
      next: (terrenos) => {
        terrenos.forEach(terreno => {
          const marker = L.marker(terreno.coordenadas).addTo(this.map);          
          const popupComponent = createComponent(TerrenoPopup, {
            environmentInjector: this.injector
          });
          popupComponent.instance.terreno = terreno;
          popupComponent.changeDetectorRef.detectChanges();
          marker.bindPopup(popupComponent.location.nativeElement);
        });
      },
      error: (err) => console.error('Error al cargar el JSON de terrenos:', err)
    });
  }
}