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
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8ZivgoO_Xeh4PXXj0wZFxUmiK8zkrN43bUa9wtFtWYuev9M9wAyC240Ijsidb8r2fa2gUzMuhDz19QPYE60FqjlyQ_I-Ji5ZeSTag0fQNTu3Uv4I9GwjVEj18xOaVx3j_DojgSVSclYDJ8t4uDfcC6VP8TWyLgHxxpqAvOgUwQXe3JkLxiqezuaqwQfb3oG6XdwuvB1-hOZpCLZq_2wozWvjODr_STf7-uJvid8BZbWc29fK89nJtAda6nrsVDjMNzJ4FEd0FCbAF'
    },
    {
      nombre: 'Torre Illimani Corporate',
      ubicacion: 'La Paz',
      avance: 32,
      fase: 'Cimientos profundos',
      rendimiento: '+8.5%',
      imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2zv9ICHl3Iq2BkU9MUUrmrSbgIrFrNwx5l-Z-UCmgH3lgKZlFtJ_vojEtE9jGlhB7NOUlA-Y2M2_2hj-e2fva4VYo3eT5w4_TgQj3Cu8dLs13sf0jW0NIQTL2pGSb7gRucFFHOQGJ2TZeaioPQHVzOeNfi6uK03TpSJrF6aSOY-kPGJ2q87NTxQxWYG9fEtdgyvMdi9Bu0C8bcXGiCqf8BJQC0CpUtxaHhrc7CulqFiZWC0yeVGYr_aUeniQYLBCv3SGHQkEOxBgu'
    }
  ];
}
