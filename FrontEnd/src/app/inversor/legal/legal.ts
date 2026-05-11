import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inversor-legal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class InversorLegal {
  documentos = [
    {
      nombre: 'Zoning Certificate - Parcel 042',
      categoria: 'Land Asset',
      auditor: 'Deloitte Legal S.L.',
      timestamp: '2023-10-24 14:22:01 UTC',
      hash: '0x84f2...a90e',
      color: 'bg-[#3b82f6]/10 text-[#3b82f6]'
    },
    {
      nombre: 'Structural Integrity Report V2',
      categoria: 'Construction',
      auditor: 'Baker McKenzie Partners',
      timestamp: '2023-10-22 09:15:45 UTC',
      hash: '0x31c8...e7fb',
      color: 'bg-[#ffb786]/10 text-[#ffb786]'
    },
    {
      nombre: 'Environmental Impact Assessment',
      categoria: 'Regulatory',
      auditor: 'Deloitte Legal S.L.',
      timestamp: '2023-10-18 11:30:12 UTC',
      hash: '0x9a44...b2cc',
      color: 'bg-[#adc6ff]/10 text-[#adc6ff]'
    }
  ];
}
