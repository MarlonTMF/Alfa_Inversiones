import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/services/auth';
import { PropertyService } from '../services/property.service';
import { NoSanitizePipe } from './no-sanitize.pipe';

interface MultimediaItem {
  id: string;
  type: 'photo' | 'video' | 'document';
  provider: string;
  url: string;
  publicId: string;
  isMain: boolean;
  label: string;
  thumbnailUrl?: string;
}

@Component({
  selector: 'app-analisis-financiero',
  standalone: true,
  imports: [CommonModule, FormsModule, NoSanitizePipe],
  templateUrl: './analisis-financiero.html',
  styleUrl: './analisis-financiero.css'
})
export class AnalisisFinanciero implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly propertyService = inject(PropertyService);
  private readonly cdr = inject(ChangeDetectorRef);


  public propertyId: string = '';
  public datosDashboard: any = null;
  public cargando: boolean = true;

  // ── MODO EDICIÓN ──────────────────────────────────────────────
  public modoEdicion: boolean = false;
  public guardando: { [campo: string]: boolean } = {};
  public get esAdmin(): boolean {
    const user = this.authService.usuarioActual();
    return user?.rol === 'admin';
  }

  // ── CARRUSEL ──────────────────────────────────────────────────
  public multimedia: MultimediaItem[] = [];
  public indiceActual: number = 0;
  public reproduciendoVideo: boolean = false;
  private autoPlayInterval: any = null;
  private readonly AUTOPLAY_DELAY = 5000; // 5 seg

  // ── GETTERS MULTIMEDIA PREMIUM ────────────────────────────────
  get portada(): MultimediaItem | null {
    const main = this.multimedia.find(m => m.type === 'photo' && m.isMain);
    if (main) return main;
    return this.multimedia.find(m => m.type === 'photo') || null;
  }

  get primerVideo(): MultimediaItem | null {
    return this.multimedia.find(m => m.type === 'video') || null;
  }

  get hayVideo(): boolean {
    return !!this.primerVideo;
  }

  toggleReproduccionVideo(): void {
    this.reproduciendoVideo = !this.reproduciendoVideo;
    if (this.reproduciendoVideo) this.detenerAutoPlay();
    else this.iniciarAutoPlay();
  }

  // ── PANEL DE GESTIÓN MULTIMEDIA ───────────────────────────────
  public panelMultimediaVisible: boolean = false;
  public subiendoImagen: boolean = false;
  public subiendoVideo: boolean = false;
  public youtubeUrl: string = '';
  public youtubeLabel: string = '';
  public agregandoYoutube: boolean = false;
  public tipoCargaVideo: 'local' | 'youtube' = 'local';


  // ── GETTERS CARRUSEL ──────────────────────────────────────────
  get itemActual(): MultimediaItem | null {
    return this.multimedia.length > 0 ? this.multimedia[this.indiceActual] : null;
  }

  get imagenesFotos(): MultimediaItem[] {
    return this.multimedia.filter(m => m.type === 'photo');
  }

  get videos(): MultimediaItem[] {
    return this.multimedia.filter(m => m.type === 'video');
  }

  get puedeAgregarVideo(): boolean {
    return this.videos.length < 3;
  }

  getFallbackImage(): string {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop';
  }

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id') || '';
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.detenerAutoPlay();
  }

  // ────────────────────────────────────────────────────────────────
  // CARGA DE DATOS
  // ────────────────────────────────────────────────────────────────
  private cargarDatos(): void {
    this.cargando = true;
    this.http.get(`https://alfa-inversiones.onrender.com/api/v1/properties/${this.propertyId}/analysis`).subscribe({
      next: (data: any) => {
        this.datosDashboard = data;
        this.procesarMultimedia(data.multimedia || []);
        this.indiceActual = 0;
        this.iniciarAutoPlay();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando datos financieros:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Procesa la lista de multimedia aplicando la lógica de portada:
   * 1. Si hay videos, el primero va al frente.
   * 2. Si no hay videos, la imagen marcada como isMain va al frente.
   */
  private procesarMultimedia(items: MultimediaItem[]): void {
    this.multimedia = [...items];
    
    const videos = this.multimedia.filter(m => m.type === 'video');
    const fotos = this.multimedia.filter(m => m.type === 'photo');

    if (videos.length > 0) {
      // Priorizar videos: mover todos al inicio
      this.multimedia = [...videos, ...fotos.sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1)];
    } else {
      // Priorizar foto principal
      this.multimedia = fotos.sort((a, b) => (a.isMain === b.isMain) ? 0 : a.isMain ? -1 : 1);
    }
  }

  refrescarMultimedia(): void {
    this.propertyService.getMultimedia(this.propertyId).subscribe({
      next: (items) => {
        this.procesarMultimedia(items);
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // MODO EDICIÓN
  // ────────────────────────────────────────────────────────────────
  toggleModoEdicion(): void {
    this.modoEdicion = !this.modoEdicion;
    // Al salir del modo edición cerramos el panel multimedia
    if (!this.modoEdicion) {
      this.panelMultimediaVisible = false;
    }
  }

  /**
   * Guarda un campo individual en el backend.
   * @param campo nombre del campo del DTO de backend (ej: 'advisorVision')
   * @param valor valor a guardar
   */
  guardarCampo(campo: string, valor: any): void {
    this.guardando[campo] = true;
    this.propertyService.updateProperty(this.propertyId, { [campo]: valor }).subscribe({
      next: () => {
        this.guardando[campo] = false;
      },
      error: (err) => {
        console.error(`Error guardando ${campo}:`, err);
        this.guardando[campo] = false;
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // CARRUSEL
  // ────────────────────────────────────────────────────────────────
  iniciarAutoPlay(): void {
    this.detenerAutoPlay();
    if (this.multimedia.length > 1) {
      this.autoPlayInterval = setInterval(() => this.siguiente(), this.AUTOPLAY_DELAY);
    }
  }

  detenerAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  anterior(): void {
    this.detenerAutoPlay();
    this.indiceActual = (this.indiceActual - 1 + this.multimedia.length) % this.multimedia.length;
    this.iniciarAutoPlay();
  }

  siguiente(): void {
    this.indiceActual = (this.indiceActual + 1) % this.multimedia.length;
  }

  irA(index: number): void {
    this.detenerAutoPlay();
    this.indiceActual = index;
    this.iniciarAutoPlay();
  }

  // ────────────────────────────────────────────────────────────────
  // GESTIÓN DE MULTIMEDIA
  // ────────────────────────────────────────────────────────────────
  togglePanelMultimedia(): void {
    this.panelMultimediaVisible = !this.panelMultimediaVisible;
    if (this.panelMultimediaVisible) this.detenerAutoPlay();
    else this.iniciarAutoPlay();
  }

  onArchivosSeleccionados(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const esVideo = files.some(f => f.type.startsWith('video/'));

    if (esVideo) this.subiendoVideo = true;
    else this.subiendoImagen = true;

    this.propertyService.uploadMultimedia(this.propertyId, files).subscribe({
      next: () => {
        this.subiendoImagen = false;
        this.subiendoVideo = false;
        this.refrescarMultimedia();
        input.value = '';
      },
      error: (err) => {
        console.error('Error subiendo archivos:', err);
        this.subiendoImagen = false;
        this.subiendoVideo = false;
      }
    });
  }

  agregarYoutube(): void {
    if (!this.youtubeUrl || !this.puedeAgregarVideo) return;
    this.agregandoYoutube = true;

    this.propertyService.addYouTubeVideo(this.propertyId, this.youtubeUrl, this.youtubeLabel || undefined).subscribe({
      next: () => {
        this.agregandoYoutube = false;
        this.youtubeUrl = '';
        this.youtubeLabel = '';
        this.refrescarMultimedia();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error agregando video YouTube:', err);
        this.agregandoYoutube = false;
        this.cdr.detectChanges();
      }
    });
  }


  marcarComoPortada(item: MultimediaItem): void {
    this.propertyService.setMainMultimedia(this.propertyId, item.id).subscribe({
      next: () => {
        this.multimedia.forEach(m => m.isMain = false);
        item.isMain = true;
        // Moverlo al frente del carrusel
        const idx = this.multimedia.indexOf(item);
        if (idx > 0) {
          this.multimedia.splice(idx, 1);
          this.multimedia.unshift(item);
          this.indiceActual = 0;
        }
      }
    });
  }

  eliminarMultimedia(item: MultimediaItem): void {
    if (!confirm(`¿Eliminar "${item.label || 'este archivo'}"?`)) return;

    this.propertyService.deleteMultimedia(this.propertyId, item.id).subscribe({
      next: () => {
        const idx = this.multimedia.indexOf(item);
        this.multimedia.splice(idx, 1);
        if (this.indiceActual >= this.multimedia.length) {
          this.indiceActual = Math.max(0, this.multimedia.length - 1);
        }
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // HELPERS
  // ────────────────────────────────────────────────────────────────
  getYoutubeThumbnail(url: string): string {
    const match = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    return this.getFallbackImage();
  }

  isVideo(item: MultimediaItem): boolean {
    return item.type === 'video';
  }

  getItemPreviewUrl(item: MultimediaItem): string {
    if (item.type === 'video') {
      if (item.provider === 'youtube') return this.getYoutubeThumbnail(item.url);
      return item.thumbnailUrl || this.getFallbackImage();
    }
    return item.url;
  }
}