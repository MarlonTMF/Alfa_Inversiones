import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresasService, Empresa } from '../../services/empresas';
@Component({
    selector: 'app-gestion-empresas',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gestion-empresas.html',
    styleUrl: './gestion-empresas.css'
})
export class GestionEmpresas implements OnInit {
    private readonly empresasService = inject(EmpresasService);
    
    public empresas: Empresa[] = [];
    public totalConstructores: number = 0;
    public totalInversionistas: number = 0;

    ngOnInit(): void {
        this.empresasService.obtenerEmpresasMock().subscribe({
            next: (data) => {
                this.empresas = data;
                this.totalConstructores = this.empresas.filter(e => e.rol === 'constructor').length;
                this.totalInversionistas = this.empresas.filter(e => e.rol === 'inversionista').length;
            },
            error: (err) => console.error('Error al cargar empresas del mock:', err)
        });
    }
}