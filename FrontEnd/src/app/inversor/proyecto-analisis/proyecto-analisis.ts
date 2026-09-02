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
    nombre: 'Complejo Empresarial Equipetrol',
    ubicacion: 'Barrio Equipetrol, Santa Cruz',
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
      titulo: 'Fase Estructural IV Completada',
      tiempo: 'Hace 2 horas',
      desc: 'Instalación de muro cortina exterior finalizada para los pisos 12-18. Firma de ingeniería obtenida para unidades primarias de balanceo de carga HVAC.',
      icon: 'engineering'
    },
    {
      titulo: 'Contrato de Alquiler: Empresa Tecnológica',
      tiempo: 'Ayer',
      desc: 'Carta de intención firmada para alquiler corporativo de oficinas premium. El alquiler base asegura el 12% de los ingresos totales del proyecto.',
      icon: 'description'
    },
    {
      titulo: 'Certificación Ambiental EDGE',
      tiempo: 'Hace 3 días',
      desc: "Auditoría provisional confirma calificación 'Excelente' en eficiencia energética y obtención de materiales sostenibles.",
      icon: 'verified_user'
    }
  ];
}
