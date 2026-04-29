import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProyectoService } from '../../core/services/proyecto.service';
import { TerrenoService } from '../../core/services/terreno.service';
import { SocioService } from '../../core/services/socio.service';
import { PropertyService } from '../../services/property.service';

function safeNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css',
})
export class ProyectoDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly proyectoService = inject(ProyectoService);
  private readonly terrenoService = inject(TerrenoService);
  private readonly socioService = inject(SocioService);
  private readonly propertyService = inject(PropertyService);

  // Flujo de Stepper
  pasoActual: number = 1;
  
  cargando = false;
  guardando = false;
  error: string | null = null;
  exito: string | null = null;

  // Datos
  proyectoId = '';
  proyecto: any = null;
  dashboard: any = null;
  documentos: any[] = [];
  multimedia: any[] = [];
  propiedades: any[] = [];
  socios: any[] = [];
  metricasHistorial: any[] = [];
  chartDataROI: any = null;

  // Formularios de carga
  docForm = { tipo: 'folio', nombre: '', url: '', estado: 'pendiente' };
  
  // Multimedia variables
  youtubeUrlInput: string = '';
  archivosImagenes: File[] = [];
  archivosVideos: File[] = [];
  fileUrls: Map<File, string> = new Map();
  errorMultimedia: string | null = null;
  videoTab: 'local' | 'youtube' = 'local';

  subiendoImagen = false;
  subiendoVideo = false;

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id') || '';
    this.cargar();
    this.terrenoService.obtenerPropiedades().subscribe({
      next: (data) => (this.propiedades = data ?? []),
      error: () => {},
    });
    this.socioService.obtenerSocios().subscribe({
      next: (data) => (this.socios = data ?? []),
      error: () => {},
    });
  }

  // ── VALIDACIÓN DEL STEPPER ───────────────────────────────────
  esPasoValido(paso: number): boolean {
    if (!this.proyecto) return false;
    switch(paso) {
      case 1: // General
        return !!(this.proyecto.nombre?.trim() && this.proyecto.tipoProyecto);
      case 2: // Activos
        return !!(this.proyecto.propertyId && this.proyecto.constructorId);
      case 3: // Análisis Financiero
        return safeNumber(this.proyecto.costoTerreno) > 0 && 
               safeNumber(this.proyecto.costoConstruccion) > 0 &&
               (safeNumber(this.proyecto.precioUnitario) > 0 || safeNumber(this.proyecto.precioVentaTotal) > 0);
      default:
        return true;
    }
  }

  irAPaso(paso: number): void {
    // Como es modo edición, permitimos salto libre para facilidad de uso
    if (paso >= 1 && paso <= 6) {
      this.pasoActual = paso;
      this.exito = null;
      this.error = null;
    }
  }

  cargar(): void {
    this.cargando = true;
    this.error = null;
    this.exito = null;

    this.proyectoService.obtenerProyecto(this.proyectoId).subscribe({
      next: (data) => {
        this.proyecto = data;
        this.cargando = false;
        this.cargarDashboard();
        this.cargarDocumentos();
        this.refrescarMultimedia();
      },
      error: () => {
        this.error = 'No se pudo cargar el proyecto.';
        this.cargando = false;
      },
    });
  }

  cargarDashboard(): void {
    this.proyectoService.obtenerDashboard(this.proyectoId).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.prepararGraficos();
      },
      error: () => (this.dashboard = null),
    });
  }

  cargarHistorialMetricas(): void {
    this.proyectoService.listarMetricas(this.proyectoId).subscribe({
      next: (data: any) => this.metricasHistorial = data,
      error: () => this.metricasHistorial = []
    });
  }

  prepararGraficos(): void {
    if (!this.dashboard) return;
    this.chartDataROI = {
      porcentaje: Math.min(Math.max(this.dashboard.roiProyectado || 0, 0), 100),
      color: (this.dashboard.roiProyectado > 20) ? '#10B981' : '#F59E0B'
    };
  }

  cargarDocumentos(): void {
    this.proyectoService.listarDocumentos(this.proyectoId).subscribe({
      next: (data) => (this.documentos = data ?? []),
      error: () => (this.documentos = []),
    });
  }

  refrescarMultimedia(): void {
    if (this.proyecto?.propertyId) {
      this.propertyService.getMultimedia(this.proyecto.propertyId).subscribe(data => this.multimedia = data);
    }
  }

  get preview(): any {
    if (!this.proyecto) return null;

    const numeroUnidades = safeNumber(this.proyecto.numeroUnidades);
    const precioUnitario = safeNumber(this.proyecto.precioUnitario);
    const precioVentaTotal = safeNumber(this.proyecto.precioVentaTotal);

    const ingresoProyectado =
      precioVentaTotal > 0
        ? precioVentaTotal
        : numeroUnidades > 0 && precioUnitario > 0
          ? numeroUnidades * precioUnitario
          : safeNumber(this.proyecto.precioVentaEstimado);

    const costoTotal =
      safeNumber(this.proyecto.costoTerreno) +
      safeNumber(this.proyecto.costoConstruccion) +
      safeNumber(this.proyecto.costoIndirectos) +
      safeNumber(this.proyecto.costoMarketing) +
      safeNumber(this.proyecto.costoPermisos) +
      safeNumber(this.proyecto.costoFinanciero) +
      safeNumber(this.proyecto.contingencia);

    const roiProyectado =
      costoTotal > 0 ? ((ingresoProyectado - costoTotal) / costoTotal) * 100 : null;
    const breakEvenUnidades = precioUnitario > 0 ? Math.ceil(costoTotal / precioUnitario) : null;

    return { ingresoProyectado, costoTotal, roiProyectado, breakEvenUnidades };
  }

  guardarYAvanzar(paso: number): void {
    if (!this.proyecto) return;
    this.guardando = true;
    this.error = null;
    this.exito = null;

    const payload = {
      nombre: this.proyecto.nombre,
      estado: this.proyecto.estado,
      tipoProyecto: this.proyecto.tipoProyecto,
      descripcion: this.proyecto.descripcion,
      propertyId: this.proyecto.propertyId || null,
      constructorId: this.proyecto.constructorId || null,
      numeroUnidades: (this.proyecto.numeroUnidades !== '' && this.proyecto.numeroUnidades !== null) ? Number(this.proyecto.numeroUnidades) : null,
      precioUnitario: (this.proyecto.precioUnitario !== '' && this.proyecto.precioUnitario !== null) ? Number(this.proyecto.precioUnitario) : null,
      precioVentaTotal: (this.proyecto.precioVentaTotal !== '' && this.proyecto.precioVentaTotal !== null) ? Number(this.proyecto.precioVentaTotal) : null,
      costoTerreno: (this.proyecto.costoTerreno !== '' && this.proyecto.costoTerreno !== null) ? Number(this.proyecto.costoTerreno) : null,
      costoConstruccion: (this.proyecto.costoConstruccion !== '' && this.proyecto.costoConstruccion !== null) ? Number(this.proyecto.costoConstruccion) : null,
      costoIndirectos: (this.proyecto.costoIndirectos !== '' && this.proyecto.costoIndirectos !== null) ? Number(this.proyecto.costoIndirectos) : null,
      costoMarketing: (this.proyecto.costoMarketing !== '' && this.proyecto.costoMarketing !== null) ? Number(this.proyecto.costoMarketing) : null,
      costoPermisos: (this.proyecto.costoPermisos !== '' && this.proyecto.costoPermisos !== null) ? Number(this.proyecto.costoPermisos) : null,
      costoFinanciero: (this.proyecto.costoFinanciero !== '' && this.proyecto.costoFinanciero !== null) ? Number(this.proyecto.costoFinanciero) : null,
      contingencia: (this.proyecto.contingencia !== '' && this.proyecto.contingencia !== null) ? Number(this.proyecto.contingencia) : null,
    };

    this.proyectoService.actualizarProyecto(this.proyectoId, payload).subscribe({
      next: (data) => {
        this.proyecto = data;
        this.guardando = false;
        this.exito = 'Cambios guardados.';
        this.cargarDashboard();
        this.irAPaso(paso);
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo guardar.';
      },
    });
  }

  // --- GESTIÓN DE DOCUMENTOS (Básico) ---
  docSeleccionado: File | null = null;
  subiendoDoc = false;

  seleccionarDocumento(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.docSeleccionado = file;
    }
  }

  agregarDocumento(): void {
    if (!this.proyecto?.propertyId) {
      this.error = 'Debe asignar un Terreno en el Paso 2 para subir documentos a la nube.';
      return;
    }
    if (!this.docSeleccionado || !this.docForm.nombre.trim()) return;

    this.subiendoDoc = true;
    this.propertyService.uploadMultimedia(this.proyecto.propertyId, [this.docSeleccionado]).subscribe({
      next: (res: any) => {
        const docData = res.data && res.data[0];
        if (docData && docData.url) {
          this.docForm.url = docData.url;
          this.proyectoService.crearDocumento(this.proyectoId, this.docForm).subscribe({
            next: () => {
              this.subiendoDoc = false;
              this.docSeleccionado = null;
              this.docForm = { tipo: 'folio', nombre: '', url: '', estado: 'pendiente' };
              this.cargarDocumentos();
              this.exito = 'Documento subido y agregado exitosamente.';
              
              // Resetear el input file si se puede, aunque Angular con FormsModule lo manejaría mejor con ViewChild.
            },
            error: () => {
              this.subiendoDoc = false;
              this.error = 'No se pudo vincular el documento al proyecto.';
            }
          });
        } else {
          this.subiendoDoc = false;
          this.error = 'No se recibió la URL de la nube.';
        }
      },
      error: () => {
        this.subiendoDoc = false;
        this.error = 'Error al subir el documento a la nube (verifique formato PDF).';
      }
    });
  }

  // --- MULTIMEDIA SELECCIÓN LOCAL ---
  manejarArchivos(event: any, tipo: 'imagen' | 'video'): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.procesarArchivoMultimedia(files[i], tipo);
      }
    }
    event.target.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent, tipo: 'imagen' | 'video'): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.procesarArchivoMultimedia(files[i], tipo);
      }
    }
  }

  private procesarArchivoMultimedia(file: File, tipo: 'imagen' | 'video'): void {
    this.errorMultimedia = null;
    const tiposPermitidos = tipo === 'imagen' ? ['image/jpeg', 'image/png'] : ['video/mp4', 'video/quicktime'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!tiposPermitidos.includes(file.type)) {
        this.errorMultimedia = `Formato no válido para ${tipo}. Archivo: ${file.name}`;
        return;
    }
    
    if (file.size > maxSize) {
        this.errorMultimedia = `El archivo supera el límite. Archivo: ${file.name}`;
        return;
    }

    this.fileUrls.set(file, URL.createObjectURL(file));
    if (tipo === 'imagen') {
      this.archivosImagenes.push(file);
    } else {
      this.archivosVideos.push(file);
    }
  }

  eliminarArchivoLocal(index: number, tipo: 'imagen' | 'video'): void {
    const lista = tipo === 'imagen' ? this.archivosImagenes : this.archivosVideos;
    const fileToDelete = lista[index];
    if (fileToDelete && this.fileUrls.has(fileToDelete)) {
        URL.revokeObjectURL(this.fileUrls.get(fileToDelete)!);
        this.fileUrls.delete(fileToDelete);
    }
    lista.splice(index, 1);
  }

  obtenerUrlLocal(file: File): string {
    return this.fileUrls.get(file) || '';
  }

  // --- MULTIMEDIA ENDPOINTS ---
  subirArchivos(tipo: 'imagen' | 'video'): void {
    const lista = tipo === 'imagen' ? this.archivosImagenes : this.archivosVideos;
    if (!this.proyecto?.propertyId || lista.length === 0) return;
    
    if (tipo === 'imagen') this.subiendoImagen = true;
    else this.subiendoVideo = true;
    
    this.propertyService.uploadMultimedia(this.proyecto.propertyId, lista).subscribe({
      next: () => {
        lista.forEach(f => {
           if (this.fileUrls.has(f)) URL.revokeObjectURL(this.fileUrls.get(f)!);
        });
        if (tipo === 'imagen') {
          this.archivosImagenes = [];
          this.subiendoImagen = false;
        } else {
          this.archivosVideos = [];
          this.subiendoVideo = false;
        }
        this.refrescarMultimedia();
        this.exito = `${tipo === 'imagen' ? 'Imágenes' : 'Videos'} subidos correctamente.`;
      },
      error: () => {
        if (tipo === 'imagen') this.subiendoImagen = false;
        else this.subiendoVideo = false;
        this.error = 'No se pudo subir la multimedia.';
      }
    });
  }

  guardarYoutubeUrl(): void {
    if (!this.proyecto?.propertyId || !this.youtubeUrlInput) return;
    this.subiendoVideo = true;
    this.propertyService.addYouTubeVideo(this.proyecto.propertyId, this.youtubeUrlInput, 'Video Youtube').subscribe({
      next: () => {
        this.youtubeUrlInput = '';
        this.subiendoVideo = false;
        this.refrescarMultimedia();
        this.exito = 'URL de YouTube agregada.';
      },
      error: () => {
        this.subiendoVideo = false;
        this.error = 'No se pudo agregar la URL.';
      }
    });
  }

  eliminarMultimediaDB(id: string): void {
    if (!this.proyecto?.propertyId || !confirm('¿Eliminar este archivo permanentemente?')) return;
    this.propertyService.deleteMultimedia(this.proyecto.propertyId, id).subscribe({
      next: () => {
        this.refrescarMultimedia();
        this.exito = 'Archivo eliminado.';
      },
      error: () => this.error = 'Error al eliminar.'
    });
  }

  marcarComoPortada(id: string): void {
    if (!this.proyecto?.propertyId) return;
    this.propertyService.setMainMultimedia(this.proyecto.propertyId, id).subscribe({
      next: () => {
        this.refrescarMultimedia();
        this.exito = 'Portada actualizada exitosamente.';
      },
      error: () => this.error = 'No se pudo actualizar la portada.'
    });
  }
}
