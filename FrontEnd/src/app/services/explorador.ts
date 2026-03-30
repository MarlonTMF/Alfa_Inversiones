import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExploradorService {
    public todosLosTerrenos = signal<any[]>([]);
    public terrenosFiltrados = signal<any[]>([]);
    public terrenoSeleccionado = signal<any>(null);
    public departamentoSeleccionado = signal<string>('Todos');
    public terrenosVisiblesIds = signal<Set<string>>(new Set());

    constructor() {}

    actualizarTerrenos(terrenos: any[]): void {
        this.todosLosTerrenos.set(terrenos);
        this.aplicarFiltros();
    }

    cambiarDepartamento(departamento: string): void {
        this.departamentoSeleccionado.set(departamento);
        this.aplicarFiltros();
    }

    seleccionarTerreno(terreno: any): void {
        this.terrenoSeleccionado.set(terreno);
    }

    actualizarVisibles(visibles: Set<string>): void {
        this.terrenosVisiblesIds.set(visibles);
        this.aplicarFiltros();
    }

    private aplicarFiltros(): void {
        const todos = this.todosLosTerrenos();
        const filtro = this.departamentoSeleccionado();
        const visibles = this.terrenosVisiblesIds();

        let filtrados = todos;
        if (filtro !== 'Todos') {
            filtrados = todos.filter(t => t.departamento === filtro);
        }

        const ordenados = [...filtrados].sort((a, b) => {
            const aVisible = visibles.has(a.id);
            const bVisible = visibles.has(b.id);
            if (aVisible && !bVisible) return -1;
            if (!aVisible && bVisible) return 1;
            return 0;
        });

        this.terrenosFiltrados.set(ordenados);
    }
}