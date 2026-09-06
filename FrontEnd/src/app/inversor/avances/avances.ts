import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inversor-avances',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './avances.html',
  styleUrl: './avances.css'
})
export class InversorAvances {
  progresoGlobal = 74;
  entregaEstimada = 'Q4 2024';
  
  hitos = [
    {
      titulo: 'Structure Level 5 Reached',
      fecha: 'OCT 14, 2023',
      desc: 'Structural integrity testing completed for the fifth floor mezzanine. Vertical concrete pouring for core columns finished 4 days ahead of schedule.',
      imagen: '/images/proyecto_torres_prado.webp',
      metrica1Label: 'Concrete Volume',
      metrica1Valor: '1,240 m³',
      metrica2Label: 'Steel Reinforcement',
      metrica2Valor: '185 Tons',
      verificado: true
    },
    {
      titulo: 'Foundations Complete',
      fecha: 'AUG 22, 2023',
      desc: 'Deep foundation pilings successfully anchored to bedrock at a depth of 45 meters. All seismic dampeners installed and certified by the municipal authority.',
      imagen: '/images/hero_constructor.webp',
      metrica1Label: 'Excavation Depth',
      metrica1Valor: '45.0m',
      metrica2Label: 'Seismic Load',
      metrica2Valor: '8.5 Richter',
      verificado: true
    }
  ];
}
