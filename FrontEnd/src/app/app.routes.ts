import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';
import { RegistroTerreno } from './registro-terreno/registro-terreno';
import { AnalisisFinanciero } from './analisis-financiero/analisis-financiero';

export const routes: Routes = [
    { path: '', redirectTo: 'mapa', pathMatch: 'full' },
    { path: 'mapa', component: Mapa },
    { path: 'registro-terreno', component: RegistroTerreno },
    { path: 'analisis/:id', component: AnalisisFinanciero },
    { path: '**', redirectTo: 'mapa' }
];