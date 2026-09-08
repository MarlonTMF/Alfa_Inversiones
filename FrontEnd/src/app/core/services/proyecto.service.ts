import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = `${API_URL}/proyectos`;

  /**
   * Antes mandaba el id del usuario en un header plano (x-admin-id), sin
   * firma ni verificacion: el backend lo aceptaba tal cual (ver AdminGuard).
   * Ahora manda el JWT real firmado en el login; si la sesion actual no
   * tiene uno (login demo/simulado, sin pasar por el backend real), estas
   * llamadas quedaran sin autorizar y el backend las rechazara.
   */
  private buildAdminHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  listarProyectos() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.buildAdminHeaders() });
  }

  crearProyecto(payload: any) {
    return this.http.post<any>(this.apiUrl, payload, { headers: this.buildAdminHeaders() });
  }

  obtenerProyecto(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.buildAdminHeaders() });
  }

  actualizarProyecto(id: string, payload: any) {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload, {
      headers: this.buildAdminHeaders(),
    });
  }

  obtenerDashboard(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}/dashboard`, {
      headers: this.buildAdminHeaders(),
    });
  }

  listarDocumentos(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/documentos`, {
      headers: this.buildAdminHeaders(),
    });
  }

  crearDocumento(id: string, payload: any) {
    return this.http.post<any>(`${this.apiUrl}/${id}/documentos`, payload, {
      headers: this.buildAdminHeaders(),
    });
  }

  // Multimedia (Específica del Proyecto)
  uploadMultimedia(proyectoId: string, files: File[], category: string = 'general') {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('category', category);
    return this.http.post<any>(`${this.apiUrl}/${proyectoId}/multimedia/upload`, formData, {
      headers: this.buildAdminHeaders(),
    });
  }

  addExternalVideo(proyectoId: string, url: string, category: string = 'general') {
    return this.http.post<any>(`${this.apiUrl}/${proyectoId}/multimedia/external`, { url, category }, {
      headers: this.buildAdminHeaders(),
    });
  }

  listarMultimedia(proyectoId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${proyectoId}/multimedia`, {
      headers: this.buildAdminHeaders(),
    });
  }

  eliminarMultimedia(proyectoId: string, fileId: string) {
    return this.http.delete(`${this.apiUrl}/${proyectoId}/multimedia/${fileId}`, {
      headers: this.buildAdminHeaders(),
    });
  }

  setMainMultimedia(proyectoId: string, fileId: string) {
    return this.http.patch(`${this.apiUrl}/${proyectoId}/multimedia/${fileId}/main`, {}, {
      headers: this.buildAdminHeaders(),
    });
  }

  listarMetricas(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/metricas`, {
      headers: this.buildAdminHeaders(),
    });
  }

  listarFases(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/fases`, {
      headers: this.buildAdminHeaders(),
    });
  }

  listarAvances(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/avances`, {
      headers: this.buildAdminHeaders(),
    });
  }

  crearAvance(id: string, payload: any) {
    return this.http.post<any>(`${this.apiUrl}/${id}/avances`, payload, {
      headers: this.buildAdminHeaders(),
    });
  }
}
