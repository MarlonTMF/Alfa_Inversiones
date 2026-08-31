/**
 * GA-Cache: Dashboard Controller
 *
 * Sirve la SPA del dashboard de visualización como contenido estático.
 */

import { Controller, Get, Res, Header } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';

@Controller('ga-cache')
export class DashboardController {
  private dashboardHtml: string;

  constructor() {
    try {
      this.dashboardHtml = readFileSync(
        join(__dirname, 'dashboard', 'index.html'),
        'utf-8',
      );
    } catch {
      this.dashboardHtml = '<h1>Dashboard no encontrado. Verifique que el archivo index.html exista en ga-cache/dashboard/</h1>';
    }
  }

  /**
   * GET /api/v1/ga-cache/dashboard
   * Sirve el dashboard HTML
   */
  @Get('dashboard')
  @Header('Content-Type', 'text/html')
  serveDashboard() {
    return this.dashboardHtml;
  }
}
