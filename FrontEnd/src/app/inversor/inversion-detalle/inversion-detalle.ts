import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inversor-inversion-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inversion-detalle.html',
  styleUrl: './inversion-detalle.css'
})
export class InversorInversionDetalle {
  // Datos simulados para la vista de detalle de una inversión específica
  inversion = {
    id: 'ASSET-8842-LT',
    nombre: 'Torres del Prado',
    descripcion: 'A flagship mixed-use high-rise in the downtown core, featuring LEED Platinum certification and 400,000 sq ft of premium Tier-A commercial space.',
    montoInvertido: 150000,
    rendimientoActual: '+14.2%',
    equityStake: '0.75%',
    progresoObra: 74,
    proximaDistribucion: 'Oct 15, 2023',
    pagoEstimado: 4250,
    ultimaActualizacion: '3 hours ago',
    descUltimaActualizacion: 'Concrete pouring for Level 5 completed.'
  };
}
