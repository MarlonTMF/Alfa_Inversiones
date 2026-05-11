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
    { label: 'Total AUM', value: '$84.2M', trend: '+12.4%', icon: 'account_balance_wallet' },
    { label: 'Active Investors', value: '1,284', trend: '+5.2%', icon: 'groups' },
    { label: 'Avg Ticket', value: '$125K', trend: '+3.1%', icon: 'token' },
    { label: 'Yield Rate', value: '14.2%', trend: '+0.8%', icon: 'trending_up' }
  ];

  inversores = [
    { 
      nombre: 'Alpha Capital Partners', 
      tipo: 'Institutional', 
      capital: '$12,450,000', 
      proyectos: 5, 
      estado: 'Active', 
      ultimaAccion: 'Capital Call Approved',
      color: 'blue'
    },
    { 
      nombre: 'Elena Rodriguez', 
      tipo: 'Private Equity', 
      capital: '$4,200,000', 
      proyectos: 3, 
      estado: 'Verified', 
      ultimaAccion: 'KYC Renewed',
      color: 'purple'
    },
    { 
      nombre: 'Nordic Wealth Fund', 
      tipo: 'Family Office', 
      capital: '$35,000,000', 
      proyectos: 12, 
      estado: 'Strategic', 
      ultimaAccion: 'New Commitment',
      color: 'emerald'
    },
    { 
      nombre: 'Inversiones Global S.A.', 
      tipo: 'Corporation', 
      capital: '$8,150,000', 
      proyectos: 7, 
      estado: 'Active', 
      ultimaAccion: 'Distribution Paid',
      color: 'amber'
    },
    { 
      nombre: 'Samuel Beckett', 
      tipo: 'Individual', 
      capital: '$1,200,000', 
      proyectos: 2, 
      estado: 'Pending', 
      ultimaAccion: 'Document Review',
      color: 'rose'
    }
  ];
}
