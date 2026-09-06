import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inversor-portafolio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.css'
})
export class InversorPortafolio {
  proyectos = [
    {
      nombre: 'Residencial Las Palmas',
      ubicacion: 'Santa Cruz',
      avance: 65,
      fase: 'Estructura y Mampostería',
      rendimiento: '+14.2%',
      imagen: '/images/proyecto_equipetrol.webp'
    },
    {
      nombre: 'Torre Illimani Corporate',
      ubicacion: 'La Paz',
      avance: 32,
      fase: 'Cimientos profundos',
      rendimiento: '+8.5%',
      imagen: '/images/proyecto_calacoto.webp'
    }
  ];
}
