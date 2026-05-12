import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { AuthService } from '../../auth/services/auth';
import { TerrenoService } from '../../core/services/terreno.service';
import { SocioService } from '../../core/services/socio.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-registro-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-proyecto.html',
  styleUrl: './registro-proyecto.css',
})
export class RegistroProyecto implements OnInit {
  private readonly proyectoService = inject(ProyectoService);
  private readonly authService = inject(AuthService);
  private readonly terrenoService = inject(TerrenoService);
  private readonly socioService = inject(SocioService);
  private readonly propertyService = inject(PropertyService);
  private readonly router = inject(Router);

  // Stepper State
  pasoActual = 1;
  modoMultimedia: 'fotos' | 'videos' = 'fotos';
  cargando = false;
  mostrarModalCategorias = false;
  error: string | null = null;
  exito: string | null = null;

  // Data Lists
  terrenos: any[] = [];
  constructoras: any[] = [];
  categoriasCostos: string[] = ['Construcción', 'Permisos', 'Marketing', 'Indirectos', 'Financiero', 'Contingencia'];

  // Form Data
  form: any = {
    nombre: '',
    descripcion: '',
    estado: 'planificacion',
    tipoProyecto: 'residencial',
    categoriaActivo: 'Lujo / Premium',
    propertyId: '',
    constructorId: '',
    // Proyecciones
    numeroUnidades: 0,
    precioUnitario: 0,
    // Costos (Dinamicos)
    costos: [
      { categoria: 'Construcción', nombre: 'Obra Gris y Acabados', monto: 0 },
      { categoria: 'Permisos', nombre: 'Licencias e Impacto Ambiental', monto: 0 },
      { categoria: 'Marketing', nombre: 'Publicidad y Showroom', monto: 0 },
      { categoria: 'Indirectos', nombre: 'Gastos de Administración', monto: 0 }
    ],
    // Multimedia
    youtubeUrl: '',
    archivosRenders: [] as File[],
    archivosFotos: [] as File[],
    archivosPlanos: [] as File[],
    archivosModelos3D: [] as File[],
    archivosVideos: [] as File[],
    portadaIndex: 0,
    documentos: [
      { tipo: 'folio', nombre: 'Folio Real', requerido: true },
      { tipo: 'catastro', nombre: 'Certificado Catastral', requerido: true },
      { tipo: 'licencia', nombre: 'Licencia de Construcción', requerido: false },
      { tipo: 'nit', nombre: 'NIT / Documento Identidad', requerido: true }
    ]
  };

  // Previsualización de renders subidos
  get renderPreviews(): string[] {
    return this.form.archivosRenders.map((f: File) => URL.createObjectURL(f));
  }

  // Previsualización de fotos subidas
  get fotoPreviews(): string[] {
    return this.form.archivosFotos.map((f: File) => URL.createObjectURL(f));
  }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.terrenoService.obtenerPropiedades().subscribe((data: any[]) => this.terrenos = data || []);
    this.socioService.obtenerSocios().subscribe((data: any[]) => this.constructoras = data || []);
  }

  // Navigation
  irAPaso(paso: number): void {
    if (paso === 2 && !this.form.nombre) {
      this.error = 'El nombre es obligatorio.';
      return;
    }
    this.pasoActual = paso;
    this.error = null;
    window.scrollTo(0, 0);
  }

  // Categorías
  nuevaCategoriaNombre = '';

  abrirModalCategorias(): void {
    this.mostrarModalCategorias = true;
  }

  cerrarModalCategorias(): void {
    this.mostrarModalCategorias = false;
  }

  agregarCategoria(): void {
    const nombre = this.nuevaCategoriaNombre.trim();
    if (nombre && !this.categoriasCostos.includes(nombre)) {
      this.categoriasCostos.push(nombre);
      this.nuevaCategoriaNombre = '';
    }
  }

  eliminarCategoria(index: number): void {
    const cat = this.categoriasCostos[index];
    // Opcional: verificar si se está usando en algún costo
    this.categoriasCostos.splice(index, 1);
  }

  // Paso 2: Costos Dinámicos
  agregarCosto(): void {
    this.form.costos.push({ categoria: 'Otros', nombre: 'Nuevo Concepto', monto: 0 });
  }

  eliminarCosto(index: number): void {
    this.form.costos.splice(index, 1);
  }

  getCostoTotal(): number {
    return this.form.costos.reduce((acc: number, c: any) => acc + (Number(c.monto) || 0), 0);
  }

  getIngresoProyectado(): number {
    return (this.form.numeroUnidades || 0) * (this.form.precioUnitario || 0);
  }

  getROI(): number {
    const total = this.getCostoTotal();
    const ingreso = this.getIngresoProyectado();
    if (total === 0) return 0;
    return ((ingreso - total) / total) * 100;
  }

  getMargenNeto(): number {
    const total = this.getCostoTotal();
    const ingreso = this.getIngresoProyectado();
    if (ingreso === 0) return 0;
    return ((ingreso - total) / ingreso) * 100;
  }

  getRiesgo(): string {
    const roi = this.getROI();
    if (roi > 30) return 'BAJO';
    if (roi > 15) return 'MEDIO';
    return 'ALTO';
  }

  // Paso 3: Multimedia
  manejarRenders(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosRenders.push(files[i]);
      }
    }
  }

  manejarFotos(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosFotos.push(files[i]);
      }
    }
  }

  manejarPlanos(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosPlanos.push(files[i]);
      }
    }
  }

  manejarModelos3D(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosModelos3D.push(files[i]);
      }
    }
  }

  manejarVideos(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosVideos.push(files[i]);
      }
    }
  }

  quitarRender(index: number): void {
    this.form.archivosRenders.splice(index, 1);
  }

  quitarFoto(index: number): void {
    this.form.archivosFotos.splice(index, 1);
    if (this.form.portadaIndex >= this.form.archivosFotos.length) {
      this.form.portadaIndex = 0;
    }
  }

  quitarPlano(index: number): void {
    this.form.archivosPlanos.splice(index, 1);
  }

  quitarModelo3D(index: number): void {
    this.form.archivosModelos3D.splice(index, 1);
  }

  videoId: string | null = null;
  videoError: string | null = null;
  videoSuccess: string | null = null;

  validarVideo(): void {
    this.videoError = null;
    this.videoSuccess = null;
    this.videoId = null;

    if (!this.form.youtubeUrl) {
      this.videoError = 'Ingrese un link';
      return;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const shortsRegExp = /youtube.com\/shorts\/([^\?\/]+)/;
    
    const match = this.form.youtubeUrl.match(regExp);
    const shortsMatch = this.form.youtubeUrl.match(shortsRegExp);

    if (match && match[2].length === 11) {
      this.videoId = match[2];
    } else if (shortsMatch && shortsMatch[1]) {
      this.videoId = shortsMatch[1];
    }

    if (this.videoId) {
      this.videoSuccess = 'Validado';
    } else {
      this.videoError = 'Inválido';
    }
  }

  resetVideoStatus(): void {
    this.videoId = null;
    this.videoError = null;
    this.videoSuccess = null;
  }

  quitarVideo(index: number): void {
    this.form.archivosVideos.splice(index, 1);
  }

  setPortada(index: number): void {
    this.form.portadaIndex = index;
  }

  // Paso 3: Bóveda Documental
  nuevoRequerimientoNombre = '';
  agregarRequerimiento(): void {
    if (this.nuevoRequerimientoNombre.trim()) {
      this.form.documentos.push({
        tipo: 'otro',
        nombre: this.nuevoRequerimientoNombre.trim(),
        requerido: false,
        archivo: null
      });
      this.nuevoRequerimientoNombre = '';
    }
  }

  eliminarRequerimiento(index: number): void {
    this.form.documentos.splice(index, 1);
  }

  prepararCargaDocumento(index: number): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.png';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.form.documentos[index].archivo = file;
        this.form.documentos[index].nombreArchivo = file.name;
      }
    };
    input.click();
  }

  // Finalizar
  finalizar(): void {
    if (this.cargando) return;
    this.error = null;
    this.cargando = true;

    // Mapeo de costos dinámicos a campos de backend
    const payload = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion,
      estado: this.form.estado,
      tipoProyecto: this.form.tipoProyecto,
      propertyId: this.form.propertyId,
      constructorId: this.form.constructorId,
      numeroUnidades: this.form.numeroUnidades,
      precioUnitario: this.form.precioUnitario,
      precioVentaTotal: this.getIngresoProyectado(),
      
      costoConstruccion: this.sumarPorCategoria('Construcción'),
      costoPermisos: this.sumarPorCategoria('Permisos'),
      costoMarketing: this.sumarPorCategoria('Marketing'),
      costoIndirectos: this.sumarPorCategoria('Indirectos'),
      costoFinanciero: this.sumarPorCategoria('Financiero'),
      contingencia: this.sumarPorCategoria('Contingencia'),
      roi: this.getROI(),
      margenUtilidad: this.getMargenNeto()
    };

    this.proyectoService.crearProyecto(payload).subscribe({
      next: (res) => {
        const proyectoId = res.id;
        this.procesarMultimediaYDocumentos(proyectoId);
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Error al crear el proyecto: ' + (err.error?.message || 'Error desconocido');
      }
    });
  }

  private procesarMultimediaYDocumentos(proyectoId: string): void {
    const subs: any[] = [];

    // 1. Renders
    if (this.form.archivosRenders.length > 0) {
      subs.push(this.proyectoService.uploadMultimedia(proyectoId, this.form.archivosRenders, 'render'));
    }

    // 2. Fotos Reales
    if (this.form.archivosFotos.length > 0) {
      subs.push(this.proyectoService.uploadMultimedia(proyectoId, this.form.archivosFotos, 'progress'));
    }

    // 3. Videos
    if (this.form.archivosVideos.length > 0) {
      subs.push(this.proyectoService.uploadMultimedia(proyectoId, this.form.archivosVideos, 'progress'));
    }

    // 4. Planos y 3D
    if (this.form.archivosPlanos.length > 0) {
      subs.push(this.proyectoService.uploadMultimedia(proyectoId, this.form.archivosPlanos, 'plano'));
    }
    if (this.form.archivosModelos3D.length > 0) {
      subs.push(this.proyectoService.uploadMultimedia(proyectoId, this.form.archivosModelos3D, '3d_model'));
    }

    // 5. YouTube URL
    if (this.form.youtubeUrl) {
      subs.push(this.proyectoService.addExternalVideo(proyectoId, this.form.youtubeUrl, 'render'));
    }

    // 6. Documentos de la Bóveda
    this.form.documentos.forEach((doc: any) => {
      if (doc.archivo) {
        // Por ahora los subimos como multimedia de tipo 'document' o implementamos endpoint específico
        subs.push(this.proyectoService.uploadMultimedia(proyectoId, [doc.archivo], 'legal'));
      }
    });

    if (subs.length === 0) {
      this.completarRegistro();
      return;
    }

    // Ejecutar todas las subidas
    let completados = 0;
    subs.forEach(s => {
      s.subscribe({
        next: () => {
          completados++;
          if (completados === subs.length) this.completarRegistro();
        },
        error: () => {
          completados++;
          if (completados === subs.length) this.completarRegistro();
        }
      });
    });
  }

  private completarRegistro(): void {
    this.cargando = false;
    this.exito = 'Proyecto y archivos sincronizados correctamente.';
    setTimeout(() => this.router.navigate(['/admin/proyectos']), 2000);
  }

  private sumarPorCategoria(cat: string): number {
    return this.form.costos
      .filter((c: any) => c.categoria === cat)
      .reduce((acc: number, c: any) => acc + (Number(c.monto) || 0), 0);
  }
}
