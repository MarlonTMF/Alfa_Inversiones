import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyecto-inversores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inversores.html',
  styleUrl: './inversores.css'
})
export class ProyectoInversores {
  @Input() proyecto: any;

  inversores = [
    { nombre: 'Inversiones Patrimoniales S.A.', capital: 4500000, participacion: 22.5, fecha: '2024-01-10' },
    { nombre: 'Roberto Gómez Silva', capital: 1200000, participacion: 6.0, fecha: '2024-01-22' },
    { nombre: 'Family Office Northern', capital: 3000000, participacion: 15.0, fecha: '2024-02-05' },
    { nombre: 'María Fernanda López', capital: 500000, participacion: 2.5, fecha: '2024-02-15' }
  ];
}
