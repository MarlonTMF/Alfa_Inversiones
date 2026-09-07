import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProyectoRegistroInversor } from '../proyecto-control-panel/inversores/registro-inversor/registro-inversor';

@Component({
  selector: 'app-directorio-inversores',
  standalone: true,
  imports: [CommonModule, ProyectoRegistroInversor],
  templateUrl: './directorio-inversores.html',
  styleUrl: './directorio-inversores.css'
})
export class DirectorioInversores {
  mostrarModalRegistro = false;

  abrirRegistro(): void {
    this.mostrarModalRegistro = true;
  }

  cerrarRegistro(): void {
    this.mostrarModalRegistro = false;
  }

  finalizarRegistro(datos: any): void {
    console.log('Inversor registrado en el directorio:', datos);
    this.cerrarRegistro();
  }
  stats = [
    { label: 'Capital Total', value: '$84.2M', trend: '+12.4%', icon: 'account_balance_wallet' },
    { label: 'Inversores Activos', value: '1,284', trend: '+5.2%', icon: 'groups' },
    { label: 'Ticket Promedio', value: '$125K', trend: '+3.1%', icon: 'token' },
    { label: 'Tasa de Rendimiento', value: '14.2%', trend: '+0.8%', icon: 'trending_up' }
  ];

  inversores = [
    {
      nombre: 'Alpha Capital Partners',
      tipo: 'Institucional',
      capital: '$12,450,000',
      proyectos: 5,
      estado: 'Activo',
      ultimaAccion: 'Llamado de capital aprobado',
      color: 'blue'
    },
    {
      nombre: 'Elena Roca',
      tipo: 'Capital Privado',
      capital: '$4,200,000',
      proyectos: 3,
      estado: 'Verificado',
      ultimaAccion: 'KYC renovado',
      color: 'purple'
    },
    {
      nombre: 'Capital Inversiones S.A.',
      tipo: 'Family Office',
      capital: '$35,000,000',
      proyectos: 12,
      estado: 'Estratégico',
      ultimaAccion: 'Nuevo compromiso',
      color: 'emerald'
    },
    {
      nombre: 'Inversiones Global S.A.',
      tipo: 'Corporativo',
      capital: '$8,150,000',
      proyectos: 7,
      estado: 'Activo',
      ultimaAccion: 'Distribución pagada',
      color: 'amber'
    },
    {
      nombre: 'Samuel Áñez',
      tipo: 'Individual',
      capital: '$1,200,000',
      proyectos: 2,
      estado: 'Pendiente',
      ultimaAccion: 'Revisión de documentos',
      color: 'rose'
    }
  ];

  filtroEstado: string | null = null;

  cicloFiltro(): void {
    const estados = [null, ...new Set(this.inversores.map((i) => i.estado))];
    const idx = estados.indexOf(this.filtroEstado);
    this.filtroEstado = estados[(idx + 1) % estados.length];
  }

  get inversoresFiltrados(): any[] {
    return this.filtroEstado ? this.inversores.filter((i) => i.estado === this.filtroEstado) : this.inversores;
  }

  exportarDatos(): void {
    const filas = [
      ['Nombre', 'Tipo', 'Capital', 'Proyectos', 'Estado'],
      ...this.inversores.map((i) => [i.nombre, i.tipo, i.capital, String(i.proyectos), i.estado]),
    ];
    const csv = filas.map((f) => f.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'directorio-inversores.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
