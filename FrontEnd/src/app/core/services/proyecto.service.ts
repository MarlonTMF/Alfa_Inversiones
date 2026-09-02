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

  private buildAdminHeaders(): HttpHeaders {
    const user = this.authService.usuarioActual();
    const adminId = user?.id || '1';
    return new HttpHeaders({ 'x-admin-id': adminId });
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
