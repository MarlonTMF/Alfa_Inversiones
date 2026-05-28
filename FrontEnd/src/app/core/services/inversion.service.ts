import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InversionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://three65-desarrollo-inmobiliario.onrender.com/api/v1/inversiones';

  registrarInversion(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, formData);
  }

  obtenerInversiones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
