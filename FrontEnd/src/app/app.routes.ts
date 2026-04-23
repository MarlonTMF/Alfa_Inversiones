import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';
import { AnalisisFinanciero } from './analisis-financiero/analisis-financiero';
import { LandingPage } from './landing-page/landing-page';
import { authGuard, adminGuard, adminOnlyGuard, superAdminGuard } from './guards/auth-guard';

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
                path: 'terrenos', 
                loadComponent: () => import('./admin/gestion-terrenos/gestion-terrenos').then(m => m.GestionTerrenos) 
            },
            { 
                path: 'registrar-socio', 
                loadComponent: () => import('./admin/registro-socio/registro-socio').then(m => m.RegistroSocio) 
            }, 
            { 
                path: 'registro-terreno', 
                loadComponent: () => import('./registro-terreno/registro-terreno').then(m => m.RegistroTerreno) 
            },
            { 
                path: 'registrar-constructor', 
                loadComponent: () => import('./registro-constructor/registro-constructor').then(m => m.RegistroConstructor) 
            },
            { 
                path: 'validar-terreno/:id', 
                loadComponent: () => import('./super-admin/property-validation/property-validation').then(m => m.PropertyValidation) 
            },
            {
                path: 'mapa',
                loadComponent: () => import('./admin/admin-mapa/admin-mapa').then(m => m.AdminMapa)
            }
        ]
    },
    { path: 'super-admin', redirectTo: 'admin', pathMatch: 'full' },
    { path: '**', redirectTo: '' }
];

