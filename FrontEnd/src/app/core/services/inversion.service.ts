import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class InversionService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/inversiones`;

  registrarInversion(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, formData);
  }

  obtenerInversiones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
