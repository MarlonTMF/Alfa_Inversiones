import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'https://three65-desarrollo-inmobiliario.onrender.com/api/v1';

  constructor(private http: HttpClient) {}

  createProperty(propertyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/properties`, propertyData);
  }

  /**
   * Actualiza campos parciales de una propiedad (Admin).
   * @param id ID de la propiedad
   * @param data Objeto con solo los campos a actualizar
   */
  updateProperty(id: string, data: Partial<any>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/properties/${id}`, data);
  }

  /**
   * Sube múltiples archivos (imágenes o videos) a la nube.
   * El backend espera un FormData con el campo 'files'.
   */
  uploadMultimedia(propertyId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.apiUrl}/propiedades/${propertyId}/multimedia/upload`, formData);
  }

  /**
   * Agrega un video de YouTube por URL (sin subir archivo).
   */
  addYouTubeVideo(propertyId: string, url: string, label?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/propiedades/${propertyId}/multimedia/external`, { url, label });
  }

  /**
   * Marca un archivo multimedia como imagen principal (portada).
   */
  setMainMultimedia(propertyId: string, fileId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/propiedades/${propertyId}/multimedia/${fileId}/main`,
      {}
    );
  }

  /**
   * Elimina un archivo multimedia de la nube y la base de datos.
   */
  deleteMultimedia(propertyId: string, fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/propiedades/${propertyId}/multimedia/${fileId}`);
  }

  /**
   * Obtiene todos los archivos multimedia de una propiedad.
   */
  getMultimedia(propertyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/propiedades/${propertyId}/multimedia`);
  }
}
