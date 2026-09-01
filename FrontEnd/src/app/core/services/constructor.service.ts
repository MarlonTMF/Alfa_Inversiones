import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/auth`;

  registrarConstructor(datos: { nombre: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      nombre: datos.nombre,
      rol: 'constructor',
      email: datos.email,
      password: datos.password
    });
  }
}
