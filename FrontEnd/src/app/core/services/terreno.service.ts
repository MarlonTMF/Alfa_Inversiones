import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

/**
 * Servicio para la gestión de terrenos y propiedades desde el Frontend.
 */
@Injectable({
  providedIn: 'root'
})
export class TerrenoService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/properties`;

  /**
   * Realiza el registro completo de un terreno y su propietario.
   * @param datos Combinación de datos técnicos y credenciales.
   */
  registrarTerrenoCompleto(datos: any): Observable<any> {
    // Si datos es FormData, HttpClient manejará el multipart
    return this.http.post(`${this.apiUrl}/register-full`, datos);
  }

  /**
   * Obtiene todas las propiedades registradas para el mapa.
   */
  obtenerPropiedades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
