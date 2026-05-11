import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-proyecto-analisis',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proyecto-analisis.html',
  styleUrl: './proyecto-analisis.css'
})
export class ProyectoAnalisis {
  // Datos simulados para la vista
  proyecto = {
    nombre: 'Apex Prime Plaza',
    ubicacion: 'Metropolitan Hub, Prime District',
    capitalAsignado: 42.8,
    capitalTotal: 52.0,
    progreso: 82,
    roi: '18.4%',
    yield: '8.5%',
    periodo: '5 Años',
    ltv: '62.0%'
  };

  pulse = [
    {
      titulo: 'Structural Phase IV Complete',
      tiempo: '2 hours ago',
      desc: 'External curtain wall installation finalized for floors 12-18. Engineering sign-off obtained for primary HVAC load-balancing units.',
      icon: 'engineering'
    },
    {
      titulo: 'Lease Agreement: Global Tech Anchor',
      tiempo: 'Yesterday',
      desc: 'Letter of Intent signed for 45,000 sq ft of premium office space. Anchoring lease secures 12% of total project revenue.',
      icon: 'description'
    },
    {
      titulo: 'BREEAM Excellence Certification',
      tiempo: '3 days ago',
      desc: "Interim audit confirms 'Outstanding' rating for energy efficiency and sustainable material sourcing.",
      icon: 'verified_user'
    }
  ];
}
