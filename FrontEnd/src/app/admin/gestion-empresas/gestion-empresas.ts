import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpresasService, Empresa } from '../../services/empresas';

@Component({
    selector: 'app-gestion-empresas',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './gestion-empresas.html',
    styleUrl: './gestion-empresas.css'
})
export class GestionEmpresas implements OnInit, OnDestroy {
    private readonly empresasService = inject(EmpresasService);
    private readonly cdr = inject(ChangeDetectorRef);
    private sub!: Subscription;
    
    public empresas: Empresa[] = [];
    public totalConstructores: number = 0;
    public totalInversionistas: number = 0;

    public textoBusqueda: string = '';
    public filtroActivo: string = 'Todos';

    ngOnInit(): void {
        this.empresasService.cargarEmpresasIniciales().subscribe({
            error: (err: any) => console.error('Error al cargar empresas del mock:', err)
        });

        this.sub = this.empresasService.empresas$.subscribe((data: Empresa[]) => {
            this.empresas = data;
            this.totalConstructores = this.empresas.filter((e: Empresa) => e.rol === 'constructor').length;
            this.totalInversionistas = this.empresas.filter((e: Empresa) => e.rol === 'inversionista').length;
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    setFiltro(filtro: string): void {
        this.filtroActivo = filtro;
    }

    get empresasFiltradas(): Empresa[] {
        return this.empresas.filter((empresa: Empresa) => {
            const cumpleBusqueda = empresa.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) || 
                                    empresa.email.toLowerCase().includes(this.textoBusqueda.toLowerCase());
            let cumpleFiltro = true;
            if (this.filtroActivo === 'Constructoras') {
                cumpleFiltro = empresa.rol === 'constructor';
            } else if (this.filtroActivo === 'Inversionistas') {
                cumpleFiltro = empresa.rol === 'inversionista';
            }
            return cumpleBusqueda && cumpleFiltro;
        });
    }
}