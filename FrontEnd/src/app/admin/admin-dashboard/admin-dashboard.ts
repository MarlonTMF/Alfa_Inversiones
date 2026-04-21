import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpresasService } from '../../services/empresas';
@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit, OnDestroy {
    private empresasService = inject(EmpresasService);
    private sub!: Subscription;
    
    public totalSocios: number = 0;

    ngOnInit(): void {
        this.empresasService.cargarEmpresasIniciales().subscribe();
        this.sub = this.empresasService.empresas$.subscribe(data => {
            this.totalSocios = data.length;
        });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}