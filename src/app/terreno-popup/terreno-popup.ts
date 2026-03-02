import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terreno-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terreno-popup.html',
  styleUrl: './terreno-popup.css'
})
export class TerrenoPopup {
  @Input() terreno: any; 
}