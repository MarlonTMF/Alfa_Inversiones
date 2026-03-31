import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'analisis/:id',
    renderMode: RenderMode.Server // Asegura que las rutas con :id no se pre-rendericen
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // El resto de rutas estáticas se mantienen rápidas
  }
];
