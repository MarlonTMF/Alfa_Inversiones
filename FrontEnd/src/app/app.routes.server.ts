import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'analisis/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/proyectos/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/proyectos/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/validar-terreno/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'inversor/inversion-detalle',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
