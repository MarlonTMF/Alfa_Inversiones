import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';
import { RegistroTerreno } from './registro-terreno/registro-terreno';

export const routes: Routes = [
    { path: '', redirectTo: 'mapa', pathMatch: 'full' },
    { path: 'mapa', component: Mapa },
    { path: 'registro-terreno', component: RegistroTerreno },
    { path: '**', redirectTo: 'mapa' }
];