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
    loadComponent: () => import('./admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./admin/gestion-empresas/gestion-empresas').then((m) => m.GestionEmpresas),
      },
      {
        path: 'terrenos',
        loadComponent: () =>
          import('./admin/gestion-terrenos/gestion-terrenos').then((m) => m.GestionTerrenos),
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./admin/gestion-proyectos/gestion-proyectos').then((m) => m.GestionProyectos),
      },
      {
        path: 'inversores',
        loadComponent: () =>
          import('./admin/directorio-inversores/directorio-inversores').then((m) => m.DirectorioInversores),
      },
      {
        path: 'proyectos/:id',
        loadComponent: () =>
          import('./admin/proyecto-control-panel/proyecto-control-panel').then(
            (m) => m.ProyectoControlPanel
          ),
      },
      {
        path: 'proyectos/:id/editar',
        loadComponent: () =>
          import('./admin/proyecto-detalle/proyecto-detalle').then((m) => m.ProyectoDetalle),
      },
      {
        path: 'registro-proyecto',
        loadComponent: () =>
          import('./admin/registro-proyecto/registro-proyecto').then((m) => m.RegistroProyecto),
      },
      {
        path: 'registro-inversion',
        loadComponent: () =>
          import('./admin/registro-inversion/registro-inversion').then((m) => m.RegistroInversion),
      },
      {
        path: 'legal/gestor',
        loadComponent: () =>
          import('./admin/legal/gestor-permisos/gestor-permisos').then((m) => m.GestorPermisos),
      },
      {
        path: 'legal/auditoria',
        loadComponent: () =>
          import('./admin/legal/auditoria/auditoria').then((m) => m.Auditoria),
      },
      {
        path: 'properties',
        redirectTo: 'terrenos',
        pathMatch: 'full',
      },
      {
        path: 'propiedades',
        redirectTo: 'terrenos',
        pathMatch: 'full',
      },
      {
        path: 'registrar-socio',
        loadComponent: () =>
          import('./admin/registro-socio/registro-socio').then((m) => m.RegistroSocio),
      },
      {
        path: 'registro-inversionista',
        loadComponent: () =>
          import('./admin/registro-inversionista/registro-inversionista').then((m) => m.RegistroInversionista),
      },
      {
        path: 'registro-terreno',
        loadComponent: () =>
          import('./registro-terreno/registro-terreno').then((m) => m.RegistroTerreno),
      },
      {
        path: 'registrar-constructor',
        loadComponent: () =>
          import('./registro-constructor/registro-constructor').then((m) => m.RegistroConstructor),
      },
      {
        path: 'validar-terreno/:id',
        loadComponent: () =>
          import('./super-admin/property-validation/property-validation').then(
            (m) => m.PropertyValidation,
          ),
      },
      {
        path: 'mapa',
        loadComponent: () => import('./admin/admin-mapa/admin-mapa').then((m) => m.AdminMapa),
      },
    ],
  },
  {
    path: 'inversor',
    loadComponent: () => import('./inversor/dashboard/dashboard').then((m) => m.InversorDashboard),
    canActivate: [authGuard]
  },
  {
    path: 'inversor/portafolio',
    loadComponent: () => import('./inversor/portafolio/portafolio').then((m) => m.InversorPortafolio),
    canActivate: [authGuard]
  },
  {
    path: 'inversor/proyecto-analisis',
    loadComponent: () => import('./inversor/proyecto-analisis/proyecto-analisis').then((m) => m.ProyectoAnalisis),
    canActivate: [authGuard]
  },
  {
    path: 'inversor/avances',
    loadComponent: () => import('./inversor/avances/avances').then((m) => m.InversorAvances),
    canActivate: [authGuard]
  },
  {
    path: 'inversor/legal',
    loadComponent: () => import('./inversor/legal/legal').then((m) => m.InversorLegal),
    canActivate: [authGuard]
  },
  {
    path: 'inversor/terminal',
    loadComponent: () => import('./inversor/terminal/terminal').then((m) => m.InversorTerminal),
    canActivate: [authGuard]
  },
  {
    path: 'inversor/inversion-detalle',
    loadComponent: () => import('./inversor/inversion-detalle/inversion-detalle').then((m) => m.InversorInversionDetalle),
    canActivate: [authGuard]
  },
  {
    path: 'constructor',
    loadComponent: () => import('./constructor/dashboard/dashboard').then((m) => m.ConstructorDashboard),
    canActivate: [authGuard]
  },
  {
    path: 'constructor/proyectos',
    loadComponent: () => import('./constructor/proyectos/proyectos').then((m) => m.ConstructorProyectos),
    canActivate: [authGuard]
  },
  {
    path: 'constructor/proyecto-detalle',
    loadComponent: () => import('./constructor/proyecto-detalle/proyecto-detalle').then((m) => m.ConstructorProyectoDetalle),
    canActivate: [authGuard]
  },
  {
    path: 'constructor/publicar-avance',
    loadComponent: () => import('./constructor/publicar-avance/publicar-avance').then((m) => m.ConstructorPublicarAvance),
    canActivate: [authGuard]
  },
  {
    path: 'constructor/legal',
    loadComponent: () => import('./constructor/legal/legal').then((m) => m.ConstructorLegal),
    canActivate: [authGuard]
  },
  {
    path: 'constructor/legal-publicacion',
    loadComponent: () => import('./constructor/legal-publicacion/legal-publicacion').then((m) => m.ConstructorLegalPublicacion),
    canActivate: [authGuard]
  },
  { path: 'super-admin', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
