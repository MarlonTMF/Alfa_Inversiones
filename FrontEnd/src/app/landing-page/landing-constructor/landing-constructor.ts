import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicNavbar } from '../../layout/public-navbar/public-navbar';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-landing-constructor',
  standalone: true,
  imports: [CommonModule, PublicNavbar],
  template: `
<app-public-navbar></app-public-navbar>

<main>
<section class="relative min-h-[870px] flex items-center overflow-hidden">
<div class="absolute inset-0 z-0">
<img alt="" class="w-full h-full object-cover opacity-30 grayscale brightness-75" src="/images/hero_constructor.webp"/>
<div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
</div>
<div class="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<div class="max-w-2xl">
<span class="text-blue-400 font-bold uppercase tracking-[0.1em] text-sm mb-4 block">Financiamiento Institucional</span>
<h2 class="text-6xl md:text-7xl font-bold tracking-tighter leading-tight mb-8">Liquidez para sus <span class="text-blue-400">Desarrollos</span></h2>
<p class="text-on-surface-variant text-lg md:text-xl mb-10 leading-relaxed max-w-lg">
                        Transformamos el capital global en infraestructura local. Acceda a fondeo estratégico diseñado para los ritmos reales de la construcción.
                    </p>
<div class="flex flex-col sm:flex-row gap-4">
<button class="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                            Solicitar Evaluación
                        </button>
<button class="border border-outline-variant hover:border-primary px-8 py-4 rounded-lg text-lg font-bold text-on-surface transition-all">
                            Ver Requisitos
                        </button>
</div>
</div>
</div>
</section>
<section class="py-24 px-6 bg-surface-container-low">
<div class="container mx-auto max-w-7xl">
<div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
<div>
<h3 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">Estructura de Capital Eficiente</h3>
<p class="text-on-surface-variant">Eliminamos las barreras financieras tradicionales.</p>
</div>
<div class="text-blue-400 font-bold text-5xl opacity-20">01 — 02</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<div class="md:col-span-7 bg-surface-container-high rounded-xl p-12 relative overflow-hidden group hover:bg-surface-bright transition-colors">
<div class="relative z-10">
<span class="material-symbols-outlined text-4xl text-blue-400 mb-6">bolt</span>
<h4 class="text-3xl font-bold mb-4">Fondeo en <span class="text-blue-400">&lt;18 días</span></h4>
<p class="text-on-surface-variant text-lg max-w-md">Velocidad de ejecución garantizada. Nuestro proceso de underwriting digital permite desembolsos en tiempo récord para mantener su obra en marcha.</p>
</div>
<div class="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-[20rem]" style="font-variation-settings: 'FILL' 1;">speed</span>
</div>
</div>
<div class="md:col-span-5 bg-[#3b82f6] text-white rounded-xl p-12 relative overflow-hidden flex flex-col justify-between">
<div class="relative z-10">
<span class="material-symbols-outlined text-4xl mb-6">assured_workload</span>
<h4 class="text-3xl font-bold mb-4">Sin Burocracia Bancaria</h4>
<p class="text-blue-100 text-lg">Evaluamos el colateral y el potencial del proyecto, no solo el historial crediticio tradicional. Flexibilidad total en estructuras.</p>
</div>
<div class="mt-8 flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                            Saber Más <span class="material-symbols-outlined">arrow_forward</span>
</div>
</div>
</div>
</div>
</section>
<section class="py-24 px-6 overflow-hidden">
<div class="container mx-auto max-w-7xl">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div>
<span class="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Tecnología de Punta</span>
<h3 class="text-4xl md:text-5xl font-bold tracking-tighter mb-12">La Ventaja LINK</h3>
<div class="space-y-12">
<div class="flex gap-6">
<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-blue-400">public</span>
</div>
<div>
<h5 class="text-xl font-bold mb-2">Acceso a Capital Global</h5>
<p class="text-on-surface-variant leading-relaxed">Conectamos sus desarrollos con fondos soberanos e institucionales de todo el mundo a través de nuestra red exclusiva.</p>
</div>
</div>
<div class="flex gap-6">
<div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-blue-400">analytics</span>
</div>
<div>
<h5 class="text-xl font-bold mb-2">Gestión Digital de Proyectos</h5>
<p class="text-on-surface-variant leading-relaxed">Monitoreo en tiempo real de estados de cuenta, proyecciones financieras y documentación de cumplimiento en un solo portal.</p>
</div>
</div>
</div>
</div>
<div class="relative">
<div class="bg-surface-container-highest rounded-2xl p-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-outline-variant/30">
<div class="rounded-xl overflow-hidden aspect-video bg-surface shadow-inner">
<img alt="Proyecto en construccion" class="w-full h-full object-cover" src="/images/proyecto_torres_prado.webp"/>
</div>
<div class="absolute -bottom-6 -left-6 glass-card p-6 rounded-xl border border-white/5 shadow-2xl">
<div class="flex items-center gap-4">
<div class="w-3 h-12 bg-blue-500 rounded-full"></div>
<div>
<div class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Tasa de Aprobación</div>
<div class="text-2xl font-bold">92.4%</div>
</div>
</div>
</div>
</div>
<div class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[120px] rounded-full"></div>
</div>
</div>
</div>
</section>
<section class="py-32 px-6">
<div class="container mx-auto max-w-5xl text-center">
<div class="bg-gradient-to-br from-surface-container-high to-surface-container-low p-16 rounded-[2rem] border border-outline-variant/20 relative overflow-hidden">
<div class="relative z-10">
<h2 class="text-4xl md:text-6xl font-bold tracking-tight mb-8">¿Listo para escalar su próximo proyecto?</h2>
<p class="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">Nuestro equipo de arquitectos financieros está listo para evaluar su portafolio en menos de 48 horas.</p>
<button class="bg-[#3b82f6] hover:bg-blue-600 text-white px-12 py-5 rounded-lg text-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                            Iniciar Solicitud Ahora
                        </button>
<p class="mt-8 text-on-surface-variant/60 font-mono text-sm tracking-widest uppercase">Consulta sin compromiso — 100% Confidencial</p>
</div>
<div class="absolute inset-0 opacity-10 pointer-events-none">
<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern height="40" id="grid" patternunits="userSpaceOnUse" width="40">
<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"></path>
</pattern>
</defs>
<rect fill="url(#grid)" height="100%" width="100%"></rect>
</svg>
</div>
</div>
</div>
</section>
</main>
<footer class="bg-surface-container-lowest py-16 px-6">
<div class="container mx-auto max-w-7xl">
<div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
<div class="col-span-1 md:col-span-1">
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-blue-400" style="font-variation-settings: 'FILL' 1;">account_balance</span>
<h1 class="text-xl font-bold tracking-tighter text-blue-500">LINK</h1>
</div>
<p class="text-on-surface-variant text-sm leading-relaxed">Infraestructura financiera para el mundo real. Conectando capital con visión arquitectónica.</p>
</div>
<div>
<h6 class="font-bold uppercase tracking-widest text-xs mb-6 text-blue-400">Soluciones</h6>
<ul class="space-y-4 text-on-surface-variant text-sm">
<li><a class="hover:text-blue-400 transition-colors" href="#">Fondo Puente</a></li>
<li><a class="hover:text-blue-400 transition-colors" href="#">Capital Mezzanine</a></li>
<li><a class="hover:text-blue-400 transition-colors" href="#">Equity de Proyecto</a></li>
</ul>
</div>
<div>
<h6 class="font-bold uppercase tracking-widest text-xs mb-6 text-blue-400">Compañía</h6>
<ul class="space-y-4 text-on-surface-variant text-sm">
<li><a class="hover:text-blue-400 transition-colors" href="#">Sobre Nosotros</a></li>
<li><a class="hover:text-blue-400 transition-colors" href="#">Inversores</a></li>
<li><a class="hover:text-blue-400 transition-colors" href="#">Privacidad</a></li>
</ul>
</div>
<div>
<h6 class="font-bold uppercase tracking-widest text-xs mb-6 text-blue-400">Contacto</h6>
<ul class="space-y-4 text-on-surface-variant text-sm">
<li><a class="hover:text-blue-400 transition-colors" href="#">Soporte Institutional</a></li>
<li><a class="hover:text-blue-400 transition-colors" href="#">Prensa</a></li>
<li><a class="hover:text-blue-400 transition-colors" href="#">Terminal Admin</a></li>
</ul>
</div>
</div>
<div class="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-xs">
<p>© LINK · Inteligencia Inmobiliaria. Todos los derechos reservados.</p>
<div class="flex gap-6">
<span class="material-symbols-outlined cursor-pointer hover:text-blue-400">public</span>
<span class="material-symbols-outlined cursor-pointer hover:text-blue-400">groups</span>
<span class="material-symbols-outlined cursor-pointer hover:text-blue-400">shield</span>
</div>
</div>
</div>
</footer>

  `,
  styles: [`
    :host { display: block; overflow-x: hidden; background-color: #0b1326; }
    .glass-card {
        background: rgba(45, 52, 73, 0.8);
        backdrop-filter: blur(12px);
    }
  `]
})
export class LandingConstructor {
    public authService = inject(AuthService);
}
