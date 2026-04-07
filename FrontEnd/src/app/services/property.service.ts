import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  // Configura aquí la URL a tu backend
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva propiedad en la base de datos
   * @param propertyData Datos de la propiedad
   */
  createProperty(propertyData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/properties`, propertyData, { headers });
  }

  /**
   * Sube un archivo multimedia asignado a un ID de propiedad específico
   * @param propertyId ID de la propiedad creada
   * @param file Archivo a subir
   */
  uploadMultimedia(propertyId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    // El backend espera la ruta de esta forma
    // POST /propiedades/:id/multimedia/upload
    return this.http.post(`${this.apiUrl}/propiedades/${propertyId}/multimedia/upload`, formData);
  }

  /**
   * Establece un archivo multimedia como principal (portada)
   * @param propertyId ID de la propiedad
   * @param fileId ID del archivo multimedia (devuelto al subirlo)
   */
  setMainMultimedia(propertyId: string, fileId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // PATCH /propiedades/:id/multimedia/:file_id/main
    return this.http.patch(`${this.apiUrl}/propiedades/${propertyId}/multimedia/${fileId}/main`, {}, { headers });
  }
}
