import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inversor-legal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class InversorLegal {
  documentos = [
    {
      nombre: 'Zoning Certificate - Parcel 042',
      categoria: 'Land Asset',
      auditor: 'Estudio Jurídico Andino S.R.L.',
      timestamp: '2023-10-24 14:22:01 UTC',
      hash: '0x84f2...a90e',
      color: 'bg-brand/10 text-brand'
    },
    {
      nombre: 'Structural Integrity Report V2',
      categoria: 'Construction',
      auditor: 'Consultora Legal Oriente',
      timestamp: '2023-10-22 09:15:45 UTC',
      hash: '0x31c8...e7fb',
      color: 'bg-tertiary/10 text-tertiary'
    },
    {
      nombre: 'Environmental Impact Assessment',
      categoria: 'Regulatory',
      auditor: 'Estudio Jurídico Andino S.R.L.',
      timestamp: '2023-10-18 11:30:12 UTC',
      hash: '0x9a44...b2cc',
      color: 'bg-primary/10 text-primary'
    }
  ];
}
