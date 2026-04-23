import { Component, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TerrenoService } from '../../core/services/terreno.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-mapa',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-mapa.html',
  styleUrl: './admin-mapa.css'
})
export class AdminMapa implements AfterViewInit, OnDestroy {
  private map: any;
  private L: any;
  private layerGroup: any;
  private readonly terrenoService = inject(TerrenoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  terrenos: any[] = [];
  terrenoSeleccionado: any = null;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initLeaflet();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initLeaflet(): void {
    import('leaflet').then(L => {
      this.L = L;
      this.initMap();
    });
  }

  private initMap(): void {
    const defaultCenter: [number, number] = [-17.7612, -63.1921]; // Santa Cruz, Bolivia
    
    this.map = this.L.map('admin-map', {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false
    });

    this.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);

    this.L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.layerGroup = this.L.layerGroup().addTo(this.map);

    this.loadProperties();
  }

  private loadProperties(): void {
    this.terrenoService.obtenerPropiedades().subscribe({
      next: (props) => {
        this.terrenos = props;
        this.renderProperties();
      },
      error: (err) => console.error('Error loading properties for admin map:', err)
    });
  }

  private renderProperties(): void {
    if (!this.L || !this.map) return;
    this.layerGroup.clearLayers();

    const bounds: any[] = [];

    this.terrenos.forEach(t => {
      if (t.polygon && Array.isArray(t.polygon)) {
        const polygon = this.L.polygon(t.polygon, {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          weight: 2
        }).addTo(this.layerGroup);

        polygon.on('click', () => {
          this.zone.run(() => {
            this.terrenoSeleccionado = t;
            this.cdr.detectChanges();
          });
        });

        const center = this.getCenter(t.polygon);
        bounds.push(center);

        // Add a marker at the center
        this.L.circleMarker(center, {
          radius: 6,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1
        }).addTo(this.layerGroup).on('click', () => {
          this.zone.run(() => {
            this.terrenoSeleccionado = t;
            this.cdr.detectChanges();
          });
        });
      }
    });

    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getCenter(coords: [number, number][]): [number, number] {
    let lat = 0, lng = 0;
    coords.forEach(c => { lat += c[0]; lng += c[1]; });
    return [lat / coords.length, lng / coords.length];
  }

  cerrarDetalle(): void {
    this.terrenoSeleccionado = null;
  }
}
