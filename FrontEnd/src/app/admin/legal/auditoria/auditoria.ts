import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css'
})
export class Auditoria {
  tramiteId = '#88291-XA';
  documentoNombre = 'ESTADO_CUENTA_Q3_2023.PDF';
  comentarios = '';

  historial = [
    { evento: 'Documento Subido', fecha: '12 Oct, 09:45', detalle: 'Usuario: Cliente_4402 (Web Portal)', color: 'primary' },
    { evento: 'Validación Automática OCR', fecha: '12 Oct, 09:46', detalle: 'Resultado: Legibilidad 98% - Pendiente firma humana.', color: 'outline' },
    { evento: 'Asignado a Auditoría', fecha: '12 Oct, 10:15', detalle: 'Responsable: Alejandro Vargas (Senior Analyst)', color: 'tertiary' }
  ];

  confirmar(): void {
    console.log('Auditoría confirmada:', this.comentarios);
  }
}
