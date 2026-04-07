import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';
import { RegistroTerreno } from './registro-terreno/registro-terreno';
import { AnalisisFinanciero } from './analisis-financiero/analisis-financiero';
import { LandingPage } from './landing-page/landing-page';
import { authGuard, adminGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'mapa', component: Mapa, canActivate: [authGuard] },
    { path: 'registro-terreno', component: RegistroTerreno, canActivate: [authGuard, adminGuard] },
    { path: 'analisis/:id', component: AnalisisFinanciero, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];