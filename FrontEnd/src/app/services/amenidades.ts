import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AmenidadesService {
  mostrarMercados = signal(false);
  mostrarTransporte = signal(false);
  mostrarColegios = signal(false);
  mostrarHospitales = signal(false);

  cargando = signal(false);
  private peticionesActivas = 0;

  toggleMercados() { this.mostrarMercados.update(v => !v); }
  toggleTransporte() { this.mostrarTransporte.update(v => !v); }
  toggleColegios() { this.mostrarColegios.update(v => !v); }
  toggleHospitales() { this.mostrarHospitales.update(v => !v); }

  iniciarCarga() {
    this.peticionesActivas++;
    this.cargando.set(true);
  }

  finalizarCarga() {
    this.peticionesActivas = Math.max(0, this.peticionesActivas - 1);
    if (this.peticionesActivas === 0) {
      this.cargando.set(false);
    }
  }
}