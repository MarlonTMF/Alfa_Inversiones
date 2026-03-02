import { Component, AfterViewInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit {
  private map: any;
  terrenoSeleccionado: any = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef // Nos ayuda a sincronizar Leaflet con Angular
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
          const areaTerreno = L.polygon(terreno.poligono, {
            className: 'poligono-terreno'
          }).addTo(this.map);
          areaTerreno.bindTooltip(`
            <div style="font-family: sans-serif; text-align: center;">
              <strong>${terreno.ubicacion}</strong><br>
              <span style="font-size: 11px; color: #666;">Clic para ver detalles</span>
            </div>
          `, { direction: 'top', sticky: true });
          areaTerreno.on('click', () => {
            this.terrenoSeleccionado = terreno;
            this.cdr.detectChanges();
            this.map.flyToBounds(areaTerreno.getBounds(), { padding: [200, 200], duration: 1 });
          });

        });
      },
      error: (err) => console.error('Error al cargar el JSON:', err)
    });
  }

  cerrarPanel(): void {
    this.terrenoSeleccionado = null;
  }
}