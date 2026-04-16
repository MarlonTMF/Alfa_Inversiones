import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

    obtenerEmpresasMock(): Observable<Empresa[]> {
        return this.http.get<any[]>('/mock-data/usuarios.json').pipe(
            map(usuarios => {
                return usuarios
                    .filter(u => u.rol === 'constructor' || u.rol === 'inversionista')
                    .map((u, index) => ({
                        id: `ENT-${9000 + index}`,
                        nombre: u.nombre,
                        email: u.email,
                        rol: u.rol,
                        estado: 'VALIDADO', 
                        especialidad: u.rol === 'constructor' ? 'Desarrollo de Obras' : 'Inyección de Capital'
                    }));
            })
        );
    }
}