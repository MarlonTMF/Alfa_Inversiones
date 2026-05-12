import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProyectoService } from '../../core/services/proyecto.service';
import { SocioService } from '../../core/services/socio.service';
import { InversionService } from '../../core/services/inversion.service';

@Component({
  selector: 'app-registro-inversion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro-inversion.html',
  styleUrl: './registro-inversion.css'
})
export class RegistroInversion implements OnInit {
  private proyectoService = inject(ProyectoService);
  private socioService = inject(SocioService);
  private inversionService = inject(InversionService);
  private cdr = inject(ChangeDetectorRef);

  pasoActual = 1;
  cargando = false;
  error: string | null = null;

  form = {
    proyectoId: '',
    inversorId: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    archivo: null as File | null
  };

  proyectos: any[] = [];
  inversores: any[] = [];
  
  searchTermProyecto = '';
  searchTermInversor = '';

  proyectoSeleccionado: any = null;
  inversorSeleccionado: any = null;

  get proyectosFiltrados() {
    return this.proyectos.filter(p => 
      p.nombre.toLowerCase().includes(this.searchTermProyecto.toLowerCase()) ||
      p.tipo_proyecto.toLowerCase().includes(this.searchTermProyecto.toLowerCase())
    );
  }

  get inversoresFiltrados() {
    return this.inversores.filter(i => 
      i.usuario.nombre.toLowerCase().includes(this.searchTermInversor.toLowerCase()) ||
      i.ci_dni.includes(this.searchTermInversor)
    );
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.proyectoService.listarProyectos().subscribe({
      next: (proyectos: any[]) => this.proyectos = proyectos,
      error: (err: any) => console.error('Error cargando proyectos:', err)
    });

    this.socioService.obtenerInversionistas().subscribe({
      next: (inversores: any[]) => this.inversores = inversores,
      error: (err: any) => console.error('Error cargando inversores:', err)
    });
  }

  seleccionarProyecto(p: any): void {
    this.proyectoSeleccionado = p;
    this.form.proyectoId = p.id;
  }

  seleccionarInversor(i: any): void {
    this.inversorSeleccionado = i;
    this.form.inversorId = i.id;
  }

  nextStep(): void {
    if (this.pasoActual === 1 && (!this.proyectoSeleccionado || !this.inversorSeleccionado)) {
      this.error = 'Debe seleccionar un proyecto y un inversionista';
      return;
    }
    this.error = null;
    if (this.pasoActual < 2) {
      this.pasoActual++;
    }
  }

  prevStep(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.form.archivo = file;
    }
  }

  finalizarRegistro(): void {
    if (this.form.monto <= 0) {
      this.error = 'El monto debe ser mayor a 0';
      return;
    }

    this.cargando = true;
    this.error = null;

    const formData = new FormData();
    formData.append('proyectoId', this.form.proyectoId);
    formData.append('inversorId', this.form.inversorId);
    formData.append('monto', this.form.monto.toString());
    formData.append('fecha', this.form.fecha);
    if (this.form.archivo) {
      formData.append('archivo', this.form.archivo);
    }

    this.inversionService.registrarInversion(formData).subscribe({
      next: () => {
        this.cargando = false;
        this.pasoActual = 3; // Éxito
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.message || 'Error al registrar la inversión';
        this.cdr.detectChanges();
      }
    });
  }

  nuevoRegistro(): void {
    this.pasoActual = 1;
    this.form = {
      proyectoId: '',
      inversorId: '',
      monto: 0,
      fecha: new Date().toISOString().split('T')[0],
      archivo: null as File | null
    };
    this.proyectoSeleccionado = null;
    this.inversorSeleccionado = null;
  }
}
