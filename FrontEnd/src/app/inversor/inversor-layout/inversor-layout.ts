import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
  IsActiveMatchOptions,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth';

export interface ItemNav {
  ruta: string;
  etiqueta: string;
  icono: string;
  /** Coincidencia exacta: solo para la raiz del panel. */
  exacta?: boolean;
}

/**
 * Cascara unica del panel del inversionista.
 *
 * Las siete pantallas dibujaban cada una su propia navegacion: cuatro
 * cascaras distintas, seis marcas distintas ("Plataforma", "Apex Console",
 * "Apex Terminal", "Consola del Inversor"...) y el nombre del usuario escrito
 * a mano en el HTML, de modo que la sesion decia una cosa y la pantalla otra.
 * Ninguna traia navegacion movil, y solo el dashboard permitia cerrar sesion,
 * ademas sin redirigir despues.
 */
@Component({
  selector: 'app-inversor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './inversor-layout.html',
  styleUrl: './inversor-layout.css',
})
export class InversorLayout {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Los cinco destinos que caben en la barra inferior movil. */
  readonly principales: ItemNav[] = [
    { ruta: '/inversor', etiqueta: 'Inicio', icono: 'dashboard', exacta: true },
    { ruta: '/inversor/portafolio', etiqueta: 'Portafolio', icono: 'business_center' },
    { ruta: '/inversor/avances', etiqueta: 'Avances', icono: 'engineering' },
    { ruta: '/inversor/legal', etiqueta: 'Legal', icono: 'lock' },
  ];

  /** El resto: en escritorio van en el sidebar, en movil tras "Mas". */
  readonly secundarias: ItemNav[] = [
    { ruta: '/inversor/proyecto-analisis', etiqueta: 'Análisis', icono: 'insights' },
    { ruta: '/inversor/terminal', etiqueta: 'Terminal de Inversión', icono: 'payments' },
    { ruta: '/mapa', etiqueta: 'Mercado', icono: 'domain' },
  ];

  /* Con {exact:true} a secas, RouterLinkActive compara tambien la query
     string, asi que cualquier ?parametro dejaba "Inicio" sin marcar. */
  readonly coincidenciaExacta: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  };
  readonly coincidenciaPrefijo: IsActiveMatchOptions = {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  };

  opciones(item: ItemNav): IsActiveMatchOptions {
    return item.exacta ? this.coincidenciaExacta : this.coincidenciaPrefijo;
  }

  readonly menuMasAbierto = signal(false);

  readonly usuario = this.authService.usuarioActual;

  /** Nombre de pila, o la razon social entera si es una empresa. */
  readonly nombreCorto = computed(() => {
    const nombre: string = this.usuario()?.nombre || '';
    if (!nombre) return 'Inversionista';
    return /S\.?A\.?|S\.?R\.?L\.?|LTDA|&|Capital|Fondo/i.test(nombre) ? nombre : nombre.split(' ')[0];
  });

  readonly etiquetaRol = computed(() =>
    (this.usuario()?.rol || 'inversionista').toString().toUpperCase(),
  );

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menuMasAbierto.set(false));
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    this.menuMasAbierto.set(false);
  }

  toggleMas(): void {
    this.menuMasAbierto.update((v) => !v);
  }

  cerrarMas(): void {
    this.menuMasAbierto.set(false);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.cerrarMas();
    // El logout del dashboard borraba la sesion pero no navegaba: la pantalla
    // se quedaba igual y el guard no se volvia a evaluar hasta el siguiente
    // cambio de ruta.
    this.router.navigate(['/']);
  }
}
