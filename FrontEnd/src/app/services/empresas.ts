import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

export interface Empresa {
    id: string;
    nombre: string;
    email: string;
    rol: 'constructor' | 'inversionista';
    estado: 'VALIDADO' | 'PENDIENTE' | 'RECHAZADO';
    especialidad: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmpresasService {
    private readonly http = inject(HttpClient);
    
    private readonly empresasSource = new BehaviorSubject<Empresa[]>([]);
    public empresas$ = this.empresasSource.asObservable();

    private datosCargados = false;

    cargarEmpresasIniciales(): Observable<Empresa[]> {
        if (this.datosCargados) {
            return this.empresas$;
        }

        return this.http.get<any[]>('/mock-data/usuarios.json').pipe(
            map(usuarios => {
                return usuarios
                    .filter(u => u.rol === 'constructor' || u.rol === 'inversionista')
                    .map((u, index): Empresa => ({
                        id: `ENT-${9000 + index}`,
                        nombre: u.nombre,
                        email: u.email,
                        rol: u.rol as 'constructor' | 'inversionista',
                        estado: 'VALIDADO', 
                        especialidad: u.rol === 'constructor' ? 'Desarrollo de Obras' : 'Inyección de Capital'
                    }));
            }),
            tap(empresas => {
                this.empresasSource.next(empresas);
                this.datosCargados = true;
            })
        );
    }

    agregarEmpresa(nuevaEmpresa: Partial<Empresa>): void {
        const empresasActuales = this.empresasSource.getValue();
        const nueva: Empresa = {
            id: `ENT-${Math.floor(Math.random() * 9000) + 1000}`,
            nombre: nuevaEmpresa.nombre || '',
            email: nuevaEmpresa.email || '',
            rol: nuevaEmpresa.rol as 'constructor' | 'inversionista',
            estado: 'PENDIENTE',
            especialidad: nuevaEmpresa.rol === 'constructor' ? 'Nueva Constructora' : 'Nuevo Inversionista'
        };
        
        this.empresasSource.next([nueva, ...empresasActuales]);
    }
}