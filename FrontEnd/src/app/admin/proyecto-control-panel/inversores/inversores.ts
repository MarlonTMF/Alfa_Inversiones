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
  @Input() inversiones: any[] = [];
}
