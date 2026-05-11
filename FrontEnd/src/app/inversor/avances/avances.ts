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
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0ujXJo5v3OJV0LIKdtzitC5ADeP1oTeA7K42ESed9yL4rCx5-vdO3EE054F7JAF5k4KKumPdf8qtwSR-TzqouxJvLFh_UHkX7arZGjTaqPnTWv0Nx5xme9mXJmY_wYX-svkDbmxTHbH7_qTXSGOP4ak0EbgcwwnabjhEDkH-gGvEww_Erlk_EVZBNP4AZQgWilvRlwHS9QiGxvEMk5ORe8LlZJWJUSKQqFIvHylgYW7Q3tDaKkPpcQfMhkEiwgA4QWGAzXYGA-XtrWg',
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
      imagen: 'https://lh3.googleusercontent.com/aida/ADBb0uh6WrgKwvsscGsF52PftdJviLiPAfDrphwgbQxCgdnJ_ZcdXkvMgle2-ZbyXkT1TGEw-iQIuhgFuM1HDWl25aR3Dsi1wVogFWAiu-EW1M5uB9eZnM4vdTD50RVhYdkcCXv22wx3GGWZSAjk8kgOATdwK4-ilaYxb2l2I_yLV5zTa9IO5BQnj51LnW-RV1ZDMfF9Xj2HaPCxQnEgkCd-DPW7xrG4ToKKuu9AsD8FKeArHIsuAfuvqf4In_ZA76dKy8qzSNK_Hr-VC-0',
      metrica1Label: 'Excavation Depth',
      metrica1Valor: '45.0m',
      metrica2Label: 'Seismic Load',
      metrica2Valor: '8.5 Richter',
      verificado: true
    }
  ];
}
