import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inversor-terminal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css'
})
export class InversorTerminal {
  montoInversion = signal(450000);
  
  roiMensual = computed(() => {
    return (this.montoInversion() * 0.012).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  });

  yieldAnual = computed(() => {
    return (this.montoInversion() * 0.144).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  });

  onMontoChange(event: any) {
    this.montoInversion.set(Number(event.target.value));
  }

  get formattedMonto() {
    return this.montoInversion().toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  }
}
