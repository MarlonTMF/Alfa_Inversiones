import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (authService.estaAutenticado()) {
        return true;
    }

    router.navigate(['/']);
    return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const usuario = authService.usuarioActual();
    const rol = usuario?.rol?.toLowerCase();
    
    // Admins can see the land registration
    if (rol === 'admin' || rol === 'super-admin') {
        return true;
    }

    router.navigate(['/mapa']);
    return false;
};

export const adminOnlyGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const usuario = authService.usuarioActual();
    const rol = usuario?.rol?.toLowerCase();

    if (rol === 'admin') {
        return true;
    }

    router.navigate(['/mapa']);
    return false;
};

export const inversorGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const usuario = authService.usuarioActual();
    const rol = usuario?.rol?.toLowerCase();

    // authGuard por si solo dejaba entrar a cualquier rol autenticado, asi
    // que un constructor podia navegar a /inversor a mano. El admin conserva
    // acceso para poder revisar el panel tal como lo ve el inversionista.
    if (rol === 'inversor' || rol === 'inversionista' || rol === 'admin' || rol === 'super-admin') {
        return true;
    }

    router.navigate([authService.rutaInicioPorRol(rol)]);
    return false;
};

export const constructorGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const usuario = authService.usuarioActual();
    const rol = usuario?.rol?.toLowerCase();

    if (rol === 'constructor' || rol === 'admin' || rol === 'super-admin') {
        return true;
    }

    router.navigate([authService.rutaInicioPorRol(rol)]);
    return false;
};

export const superAdminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const usuario = authService.usuarioActual();
    const rol = usuario?.rol?.toLowerCase();
    
    // Only super-admins can see the new dashboard
    if (rol === 'super-admin') {
        return true;
    }

    router.navigate(['/mapa']);
    return false;
};

