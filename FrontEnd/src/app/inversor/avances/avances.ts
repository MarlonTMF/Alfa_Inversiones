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
      titulo: 'Estructura: quinto nivel alcanzado',
      fecha: '14 OCT 2025',
      desc: 'Concluidas las pruebas de integridad estructural del entrepiso del quinto nivel. El vaciado de columnas del núcleo terminó 4 días antes de lo previsto.',
      imagen: '/images/proyecto_torres_prado.webp',
      metrica1Label: 'Volumen de hormigón',
      metrica1Valor: '1,240 m³',
      metrica2Label: 'Acero de refuerzo',
      metrica2Valor: '185 toneladas',
      verificado: true
    },
    {
      titulo: 'Fundaciones concluidas',
      fecha: '22 AGO 2025',
      desc: 'Pilotes de fundación profunda anclados a roca firme a 45 metros. Amortiguadores sísmicos instalados y certificados por la autoridad municipal.',
      imagen: '/images/hero_constructor.webp',
      metrica1Label: 'Profundidad de excavación',
      metrica1Valor: '45.0m',
      metrica2Label: 'Carga sísmica',
      metrica2Valor: '8.5 Richter',
      verificado: true
    }
  ];
}
