import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AmenidadesService {
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

  obtenerAmenidades(tipo: string, lat: number, lng: number): Observable<any[]> {
    this.iniciarCarga(tipo);

    // TODO REFACTOR BACKEND:
    // Reemplazar la constante 'elementosMock' y el 'of().pipe(delay)' por la petición real HTTP:
    // return this.http.get<any[]>(`https://three65-desarrollo-inmobiliario.onrender.com/api/v1/amenidades?tipo=${tipo}&lat=${lat}&lng=${lng}`);

    const cantidad = Math.floor(Math.random() * 4) + 3;
    const elementosMock = Array.from({ length: cantidad }).map((_, i) => {
      const offsetLat = (Math.random() - 0.5) * 0.015;
      const offsetLng = (Math.random() - 0.5) * 0.015;
      
      return {
        lat: lat + offsetLat,
        lon: lng + offsetLng,
        tags: { name: `${tipo.toUpperCase()} (Mock ${i + 1})` }
      };
    });

    return of(elementosMock).pipe(delay(800));
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