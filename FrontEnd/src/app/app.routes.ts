import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';
import { RegistroTerreno } from './registro-terreno/registro-terreno';
import { AnalisisFinanciero } from './analisis-financiero/analisis-financiero';
import { LandingPage } from './landing-page/landing-page';
import { authGuard, adminGuard, adminOnlyGuard, superAdminGuard } from './guards/auth-guard';
import { SuperAdminDashboard } from './super-admin/dashboard/dashboard';
import { ConstructorManagement } from './super-admin/constructor-management/constructor-management';
import { PropertyManagement } from './super-admin/property-management/property-management';
import { PropertyValidation } from './super-admin/property-validation/property-validation';
import { RegistroConstructor } from './registro-constructor/registro-constructor';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'mapa', component: Mapa, canActivate: [authGuard] },
    { path: 'registro-terreno', component: RegistroTerreno, canActivate: [authGuard, adminGuard] },
    { path: 'registro-constructor', component: RegistroConstructor, canActivate: [authGuard, adminOnlyGuard] },
    { path: 'analisis/:id', component: AnalisisFinanciero, canActivate: [authGuard] },
    { path: 'admin/dashboard', component: SuperAdminDashboard, canActivate: [authGuard, superAdminGuard] },
    { path: 'admin/constructors', component: ConstructorManagement, canActivate: [authGuard, superAdminGuard] },
    { path: 'admin/properties', component: PropertyManagement, canActivate: [authGuard, superAdminGuard] },
    { path: 'admin/validation/:id', component: PropertyValidation, canActivate: [authGuard, superAdminGuard] },
    { path: '**', redirectTo: '' }
];

