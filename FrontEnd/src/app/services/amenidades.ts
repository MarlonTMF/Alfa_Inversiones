import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AmenidadesService {
  private readonly http = inject(HttpClient);

  /** Filtro Overpass QL y radio de busqueda (metros) por categoria del mapa. */
  private readonly consultasPorTipo: Record<string, { filtro: string; radio: number }> = {
    salud: { filtro: '["amenity"~"^(hospital|clinic|doctors|pharmacy)$"]', radio: 1500 },
    educacion: { filtro: '["amenity"~"^(school|university|college|kindergarten)$"]', radio: 1500 },
    // ["shop"] a secas (cualquier valor) obliga a Overpass a recorrer TODA
    // tienda etiquetada sin importar el tipo: en una ciudad densa (La Paz,
    // Santa Cruz) la consulta tarda minutos o directamente no responde.
    // Acotado a los rubros que de verdad describen una "zona comercial".
    comercio: {
      filtro: '["shop"~"^(supermarket|mall|convenience|department_store|marketplace|bakery)$"]',
      radio: 800,
    },
    transporte: { filtro: '["highway"="bus_stop"]', radio: 800 },
  };

  /**
   * overpass-api.de es la instancia publica de referencia, pero es un
   * recurso gratuito compartido por todo internet: bajo carga puede tardar
   * mucho o directamente no responder, y sin limite de tiempo la barra de
   * carga se quedaba trabada en 98% para siempre. Si la primera no
   * responde a tiempo se reintenta una vez contra un espejo alternativo
   * antes de rendirse.
   */
  private readonly espejosOverpass = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];
  private readonly tiempoLimiteMs = 12_000;
  mostrarMercados = signal(false);
  mostrarTransporte = signal(false);
  mostrarColegios = signal(false);
  mostrarHospitales = signal(false);

  cargando = signal(false);
  progreso = signal(0);
  mensajeCarga = signal('Cargando...');
  subMensaje = signal('');

  private peticionesActivas = 0;
  private timerProgreso: any = null;

  toggleMercados() { this.mostrarMercados.update(v => !v); }
  toggleTransporte() { this.mostrarTransporte.update(v => !v); }
  toggleColegios() { this.mostrarColegios.update(v => !v); }
  toggleHospitales() { this.mostrarHospitales.update(v => !v); }

  /**
   * Amenidades reales alrededor de un punto, via Overpass API (el motor de
   * consultas publico de OpenStreetMap: gratis, sin clave, sin backend
   * propio). Antes esto generaba puntos aleatorios con nombres inventados
   * ("SALUD (Mock 4)"): ahora el nombre que se ve en el mapa es el real
   * (tags.name), tal como esta cargado en OpenStreetMap para ese lugar.
   */
  obtenerAmenidades(tipo: string, lat: number, lng: number): Observable<any[]> {
    this.iniciarCarga(tipo);

    const config = this.consultasPorTipo[tipo] ?? { filtro: '["amenity"]', radio: 1200 };
    const consulta =
      `[out:json][timeout:15];` +
      `(node${config.filtro}(around:${config.radio},${lat},${lng});` +
      `way${config.filtro}(around:${config.radio},${lat},${lng}););` +
      `out center 30;`;
    const cuerpo = new URLSearchParams({ data: consulta }).toString();

    return this.consultarEspejo(0, cuerpo);
  }

  private consultarEspejo(indice: number, cuerpo: string): Observable<any[]> {
    const url = this.espejosOverpass[indice];
    const esUltimoEspejo = indice === this.espejosOverpass.length - 1;

    return this.http
      .post<{ elements: any[] }>(url, cuerpo, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        timeout(this.tiempoLimiteMs),
        map((res) => res.elements || []),
        catchError((err) =>
          esUltimoEspejo ? throwError(() => err) : this.consultarEspejo(indice + 1, cuerpo)
        ),
      );
  }

  iniciarCarga(tipo?: string) {
    this.peticionesActivas++;

    const mensajes: any = {
      salud: 'Localizando centros de salud...',
      educacion: 'Buscando centros educativos...',
      comercio: 'Identificando zonas comerciales...',
      transporte: 'Analizando transporte público...',
      terrenos: 'Cargando activos inmobiliarios...'
    };

    if (tipo) {
      this.mensajeCarga.set(mensajes[tipo] || 'Actualizando mapa...');
      this.subMensaje.set('Esta búsqueda se hará por única vez. La disponibilidad posterior será inmediata.');
    }

    if (!this.cargando()) {
      this.cargando.set(true);
      this.progreso.set(5);
      this.iniciarAnimacionProgreso();
    }
  }

  finalizarCarga(exito: boolean = true) {
    this.peticionesActivas = Math.max(0, this.peticionesActivas - 1);
    if (this.peticionesActivas === 0) {
      this.detenerAnimacionProgreso();

      if (exito) {
        this.progreso.set(100);
        this.mensajeCarga.set('¡Completado!');
        this.subMensaje.set('Datos actualizados en el mapa.');
      } else {
        this.mensajeCarga.set('Sin resultados');
        this.subMensaje.set('Intenta en otra zona.');
      }

      setTimeout(() => {
        if (this.peticionesActivas === 0) {
          this.cargando.set(false);
          setTimeout(() => {
            if (!this.cargando()) {
              this.progreso.set(0);
              this.subMensaje.set('');
            }
          }, 200);
        }
      }, 400);
    }
  }

  private iniciarAnimacionProgreso() {
    this.detenerAnimacionProgreso();
    this.timerProgreso = setInterval(() => {
      const actual = this.progreso();
      if (actual < 98) {
        const incremento = (99 - actual) / 15;
        this.progreso.set(actual + incremento);
      }
    }, 200);
  }

  private detenerAnimacionProgreso() {
    if (this.timerProgreso) {
      clearInterval(this.timerProgreso);
      this.timerProgreso = null;
    }
  }
}