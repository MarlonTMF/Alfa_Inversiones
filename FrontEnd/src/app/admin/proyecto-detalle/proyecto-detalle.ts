import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { TerrenoService } from '../../core/services/terreno.service';
import { SocioService } from '../../core/services/socio.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css',
})
export class ProyectoDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly proyectoService = inject(ProyectoService);
  private readonly terrenoService = inject(TerrenoService);
  private readonly socioService = inject(SocioService);
  private readonly propertyService = inject(PropertyService);
  private readonly router = inject(Router);

  // Stepper State
  pasoActual = 1;
  modoMultimedia: 'renders' | 'fotos' | 'videos' = 'renders';
  cargando = false;
  guardando = false;
  mostrarModalCategorias = false;
  error: string | null = null;
  exito: string | null = null;

  // Data Lists
  terrenos: any[] = [];
  constructoras: any[] = [];
  categoriasCostos: string[] = ['Construcción', 'Permisos', 'Marketing', 'Indirectos', 'Financiero', 'Contingencia'];
  categoriasAbiertas: { [key: string]: boolean } = { 'Construcción': true };
  nuevoRequerimientoNombre = '';
  
  // Multimedia Previews
  renderPreviews: string[] = [];
  fotoPreviews: string[] = [];

  // Project ID
  proyectoId = '';

  // Form Data
  form: any = {
    nombre: '',
    descripcion: '',
    tipoProyecto: 'residencial',
    categoriaActivo: 'Estándar',
    propertyId: '',
    constructorId: '',
    estado: 'planificacion',
    numeroUnidades: 0,
    precioUnitario: 0,
    costos: [],
    archivosRenders: [],
    archivosFotos: [],
    archivosVideos: [],
    archivosPlanos: [],
    archivosModelos3D: [],
    portadaIndex: 0,
    youtubeUrl: '',
    documentos: [
      { tipo: 'legal', nombre: 'Folio Real', requerido: true, archivo: null },
      { tipo: 'legal', nombre: 'Impuestos Al Día', requerido: true, archivo: null },
      { tipo: 'legal', nombre: 'Certificado Catastral', requerido: true, archivo: null }
    ]
  };

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id') || '';
    this.cargarDatosIniciales();
    
    // Cargamos el mock por defecto para asegurar que siempre haya algo que ver
    this.cargarProyectoMock();

    // Si tenemos un ID válido (no null/mock), intentamos cargar de la API
    if (this.proyectoId && this.proyectoId !== 'mock' && this.proyectoId !== 'null') {
      this.cargarProyecto();
    }
  }

  cargarProyectoMock(): void {
    this.form = {
      nombre: 'Residencial Sky Tower (MOCK)',
      descripcion: 'Desarrollo de lujo con vistas panorámicas al valle, 24 pisos de departamentos inteligentes y áreas comunes de primer nivel incluyendo piscina infinita y gimnasio 360.',
      tipoProyecto: 'residencial',
      categoriaActivo: 'Lujo / Premium',
      propertyId: '1',
      constructorId: '1',
      estado: 'fundraising',
      numeroUnidades: 48,
      precioUnitario: 125000,
      costos: [
        { categoria: 'Construcción', nombre: 'Obra Gruesa y Cimentación', monto: 1200000 },
        { categoria: 'Permisos', nombre: 'Licencia Ambiental', monto: 45000 },
        { categoria: 'Marketing', nombre: 'Campaña Lanzamiento Digital', monto: 25000 },
        { categoria: 'Indirectos', nombre: 'Honorarios Arquitectura', monto: 80000 }
      ],
      archivosRenders: [],
      archivosFotos: [],
      archivosVideos: [],
      portadaIndex: 0,
      documentos: [
        { tipo: 'legal', nombre: 'Folio Real Verificado', requerido: true, archivo: null },
        { tipo: 'legal', nombre: 'Plano de Loteamiento', requerido: true, archivo: null },
        { tipo: 'legal', nombre: 'Certificado de Alodio', requerido: false, archivo: null }
      ]
    };
    this.renderPreviews = [
      'https://images.unsplash.com/photo-1545324418-f1d3c5b5a271?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop'
    ];
    this.fotoPreviews = [
      'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000&auto=format&fit=crop'
    ];
  }

  cargarDatosIniciales(): void {
    this.terrenoService.obtenerPropiedades().subscribe(data => this.terrenos = data || []);
    this.socioService.obtenerSocios().subscribe(data => this.constructoras = data || []);
  }

  cargarProyecto(): void {
    this.cargando = true;
    this.proyectoService.obtenerProyecto(this.proyectoId).subscribe({
      next: (proy: any) => {
        this.form.nombre = proy.nombre;
        this.form.descripcion = proy.descripcion;
        this.form.tipoProyecto = proy.tipoProyecto || 'residencial';
        this.form.categoriaActivo = proy.categoriaActivo || 'Estándar';
        this.form.propertyId = proy.propertyId;
        this.form.constructorId = proy.constructorId;
        this.form.estado = proy.estado || 'planificacion';
        this.form.numeroUnidades = proy.numeroUnidades || 0;
        this.form.precioUnitario = proy.precioUnitario || 0;
        
        // Mapear costos si existen en formato de base de datos
        if (proy.costos && proy.costos.length > 0) {
          this.form.costos = proy.costos;
        } else {
          // Fallback a campos individuales si no hay lista de costos
          this.form.costos = [
            { categoria: 'Construcción', nombre: 'Obra Gruesa', monto: proy.costoConstruccion || 0 },
            { categoria: 'Permisos', nombre: 'Licencia Municipal', monto: proy.costoPermisos || 0 }
          ];
        }

        this.cargando = false;
      },
      error: () => {
        // En caso de error, cargamos el mock para que el usuario vea la interfaz
        this.cargarProyectoMock();
        this.error = 'Cargando versión de demostración (API no disponible).';
        this.cargando = false;
      }
    });
  }

  // --- LÓGICA DE NEGOCIO ---
  getIngresoProyectado(): number {
    return (this.form.numeroUnidades || 0) * (this.form.precioUnitario || 0);
  }

  getCostoTotal(): number {
    return this.form.costos.reduce((acc: number, c: any) => acc + (c.monto || 0), 0);
  }

  getMargenNeto(): number {
    const ingresos = this.getIngresoProyectado();
    const costos = this.getCostoTotal();
    if (ingresos === 0) return 0;
    return ((ingresos - costos) / ingresos) * 100;
  }

  getRiesgo(): string {
    const margen = this.getMargenNeto();
    if (margen > 30) return 'BAJO';
    if (margen > 15) return 'MEDIO';
    return 'ALTO';
  }

  // --- NAVEGACIÓN ---
  irAPaso(paso: number): void {
    this.pasoActual = paso;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- GESTIÓN DE COSTOS (POR CATEGORÍAS) ---
  nuevaCategoriaNombre = '';
  abrirModalCategorias() { this.mostrarModalCategorias = true; }
  cerrarModalCategorias() { this.mostrarModalCategorias = false; }
  
  agregarCategoria() {
    if (this.nuevaCategoriaNombre.trim()) {
      this.categoriasCostos.push(this.nuevaCategoriaNombre.trim());
      this.nuevaCategoriaNombre = '';
    }
  }

  eliminarCategoria(index: number) {
    this.categoriasCostos.splice(index, 1);
  }

  getCostosPorCategoria(categoria: string): any[] {
    return (this.form.costos || []).filter((c: any) => c.categoria === categoria);
  }

  agregarCostoACategoria(categoria: string): void {
    if (!this.form.costos) this.form.costos = [];
    this.form.costos.push({ categoria, nombre: '', monto: 0 });
  }

  eliminarCostoPorReferencia(costo: any): void {
    this.form.costos = this.form.costos.filter((c: any) => c !== costo);
  }

  toggleCategoria(cat: string): void {
    this.categoriasAbiertas[cat] = !this.categoriasAbiertas[cat];
  }

  isCategoriaAbierta(cat: string): boolean {
    return !!this.categoriasAbiertas[cat];
  }

  getCostoTotalCategoria(categoria: string): number {
    return this.getCostosPorCategoria(categoria).reduce((acc, curr) => acc + (curr.monto || 0), 0);
  }

  // --- MULTIMEDIA ---
  manejarRenders(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosRenders.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => this.renderPreviews.push(e.target.result);
        reader.readAsDataURL(files[i]);
      }
    }
  }

  manejarFotos(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.form.archivosFotos.push(files[i]);
        const reader = new FileReader();
        reader.onload = (e: any) => this.fotoPreviews.push(e.target.result);
        reader.readAsDataURL(files[i]);
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

  quitarRender(index: number): void {
    this.form.archivosRenders.splice(index, 1);
    this.renderPreviews.splice(index, 1);
  }

  quitarFoto(index: number): void {
    this.form.archivosFotos.splice(index, 1);
    this.fotoPreviews.splice(index, 1);
    if (this.form.portadaIndex >= this.form.archivosFotos.length) {
      this.form.portadaIndex = 0;
    }
  }

  quitarVideo(index: number): void {
    this.form.archivosVideos.splice(index, 1);
  }

  setPortada(index: number): void {
    this.form.portadaIndex = index;
  }

  // --- DOCUMENTACIÓN ---
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

  // --- FINALIZAR / ACTUALIZAR ---
  finalizar(): void {
    this.guardando = true;
    this.error = null;

    // Aquí iría la lógica de conversión a FormData para soportar archivos
    // Por ahora simulamos éxito
    console.log('Datos a actualizar:', this.form);
    
    this.proyectoService.actualizarProyecto(this.proyectoId, this.form).subscribe({
      next: () => {
        this.exito = 'Proyecto actualizado exitosamente.';
        this.guardando = false;
        setTimeout(() => this.router.navigate(['/admin/proyectos', this.proyectoId]), 2000);
      },
      error: () => {
        this.error = 'Error al actualizar el proyecto en el servidor.';
        this.guardando = false;
      }
    });
  }
}
