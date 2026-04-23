import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocioService } from '../../core/services/socio.service';

@Component({
    selector: 'app-gestion-empresas',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './gestion-empresas.html',
    styleUrl: './gestion-empresas.css'
})
export class GestionEmpresas implements OnInit, OnDestroy {
    private readonly socioService = inject(SocioService);
    private readonly cdr = inject(ChangeDetectorRef);
    private sub!: Subscription;

    public empresas: any[] = [];
    public totalConstructores: number = 0;
    public totalInversionistas: number = 0;

    public textoBusqueda: string = '';
    public filtroActivo: string = 'Todos';

    ngOnInit(): void {
        this.cargarSocios();
    }

    private cargarSocios(): void {
        this.socioService.obtenerSocios().subscribe({
            next: (data) => {
                this.empresas = data.map(item => ({
                    ...item,
                    nombre: item.nombre_empresa || item.usuario?.nombre,
                    email: item.usuario?.email,
                    rol: item.usuario?.rol,
                    fecha: item.fecha_creacion,
                    especialidadesParsed: this.parseJson(item.especialidades),
                    maquinariaParsed: this.parseJson(item.maquinaria)
                }));
                this.totalConstructores = this.empresas.filter(e => e.rol === 'constructor').length;
                this.totalInversionistas = this.empresas.filter(e => e.rol === 'inversionista').length;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error al cargar socios:', err)
        });
    }

    private parseJson(val: any): string[] {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    setFiltro(filtro: string): void {
        this.filtroActivo = filtro;
    }

    get empresasFiltradas(): any[] {
        return this.empresas.filter((empresa: any) => {
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