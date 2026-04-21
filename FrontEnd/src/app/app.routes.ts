import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';
import { AnalisisFinanciero } from './analisis-financiero/analisis-financiero';
import { LandingPage } from './landing-page/landing-page';
import { authGuard, adminGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'mapa', component: Mapa, canActivate: [authGuard] },
    { path: 'analisis/:id', component: AnalisisFinanciero, canActivate: [authGuard] },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin-layout/admin-layout').then(m => m.AdminLayout),
        canActivate: [authGuard, adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { 
                path: 'dashboard', 
                loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) 
            },
            { 
                path: 'empresas', 
                loadComponent: () => import('./admin/gestion-empresas/gestion-empresas').then(m => m.GestionEmpresas) 
            },
            { 
                path: 'registrar-socio', 
                loadComponent: () => import('./admin/registro-socio/registro-socio').then(m => m.RegistroSocio) 
            }, 
            { 
                path: 'registrar-terreno', 
                loadComponent: () => import('./registro-terreno/registro-terreno').then(m => m.RegistroTerreno) 
            }
        ]
    },
    { path: '**', redirectTo: '' }
];