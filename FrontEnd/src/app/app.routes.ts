import { Routes } from '@angular/router';
import { Mapa } from './mapa/mapa';

export const routes: Routes = [
    { path: '', redirectTo: 'mapa', pathMatch: 'full' },
    { path: 'mapa', component: Mapa },
    { path: '**', redirectTo: 'mapa' }
];