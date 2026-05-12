import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/socios';

  registrarSocio(datos: any): Observable<any> {
    // Si datos es FormData, HttpClient pondrá automáticamente el boundary y Content-Type correcto
    return this.http.post(`${this.apiUrl}/registrar`, datos);
  }

  registrarInversionista(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-inversionista`, datos);
  }

  obtenerInversionistas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inversionistas`);
  }

  obtenerSocios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
