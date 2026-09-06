import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicNavbar } from '../../layout/public-navbar/public-navbar';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-landing-inversor',
  standalone: true,
  imports: [CommonModule, PublicNavbar],
  template: `
<app-public-navbar></app-public-navbar>

<main class="min-h-screen bg-surface text-on-surface">
<section class="relative h-[819px] w-full flex items-center px-12 overflow-hidden">
<div class="absolute inset-0 z-0">
<img alt="" class="w-full h-full object-cover opacity-40 mix-blend-luminosity" src="/images/proyecto_equipetrol.webp"/>
<div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
</div>
<div class="relative z-10 max-w-4xl">
<div class="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
<span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
<span class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Acceso Institucional Exclusivo</span>
</div>
<h1 class="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tighter mb-8 font-display">
                    Invierte en el <span class="text-blue-400">Futuro</span> del Real Estate
                </h1>
<p class="text-xl text-on-surface-variant max-w-xl leading-relaxed mb-10 font-light">
                    Acceda a vehículos de inversión optimizados con estructuras de gobernanza de nivel institucional y despliegue de capital en activos premium globales.
                </p>
<div class="flex items-center gap-6">
<button class="bg-[#3b82f6] text-white px-8 py-4 rounded-lg font-bold transition-transform active:scale-95 shadow-lg shadow-blue-500/20">
                        Comenzar Inversión
                    </button>
<button class="bg-surface-container-highest/50 backdrop-blur-md text-on-surface px-8 py-4 rounded-lg font-bold border border-outline-variant/30 hover:bg-surface-container-highest transition-colors">
                        Ver Portafolio
                    </button>
</div>
</div>
</section>
<section class="px-12 py-24 bg-surface-container-lowest">
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="p-10 rounded-2xl bg-surface-container-low border border-white/5 hover:border-blue-500/30 transition-all duration-300">
<p class="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">AUM</p>
<div class="flex items-baseline gap-2 mb-2">
<span class="text-5xl font-black text-on-surface tracking-tighter">$4.2B</span>
</div>
<p class="text-on-surface-variant text-sm font-light">Capital gestionado en activos reales a través de mercados europeos y americanos.</p>
</div>
<div class="p-10 rounded-2xl bg-surface-container-low border border-white/5 hover:border-blue-500/30 transition-all duration-300">
<p class="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Inversores</p>
<div class="flex items-baseline gap-2 mb-2">
<span class="text-5xl font-black text-on-surface tracking-tighter">1,250+</span>
</div>
<p class="text-on-surface-variant text-sm font-light">Family offices e instituciones financieras confían en nuestra arquitectura de capital.</p>
</div>
<div class="p-10 rounded-2xl bg-surface-container-low border border-white/5 hover:border-blue-500/30 transition-all duration-300">
<p class="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Presencia</p>
<div class="flex items-baseline gap-2 mb-2">
<span class="text-5xl font-black text-on-surface tracking-tighter">12</span>
</div>
<p class="text-on-surface-variant text-sm font-light">Países con operaciones locales y sourcing de activos de alta rentabilidad.</p>
</div>
</div>
</section>
<section class="px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
<div>
<h2 class="text-4xl font-bold tracking-tight mb-8">Ventajas Competitivas e <span class="text-blue-400">Integridad Operativa</span></h2>
<div class="space-y-12">
<div class="flex gap-6">
<div class="w-14 h-14 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
<span class="material-symbols-outlined text-3xl">hub</span>
</div>
<div>
<h3 class="text-xl font-bold mb-3">Acceso Directo</h3>
<p class="text-on-surface-variant leading-relaxed font-light">Eliminamos intermediarios innecesarios mediante tecnología propia, permitiendo una conexión directa entre el capital y el activo subyacente.</p>
</div>
</div>
<div class="flex gap-6">
<div class="w-14 h-14 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
<span class="material-symbols-outlined text-3xl">gavel</span>
</div>
<div>
<h3 class="text-xl font-bold mb-3">Gobernanza Institucional</h3>
<p class="text-on-surface-variant leading-relaxed font-light">Estructuras legales robustas y auditoría continua por firmas Big Four para garantizar la transparencia y seguridad de cada inversión.</p>
</div>
</div>
</div>
</div>
<div class="relative">
<div class="aspect-square rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
<img alt="Proyecto en cartera" class="w-full h-full object-cover" src="/images/proyecto_calacoto.webp"/>
</div>
<div class="absolute -bottom-10 -left-10 p-8 glass-panel rounded-2xl border border-white/10 shadow-2xl max-w-xs">
<div class="flex items-center gap-3 mb-4">
<span class="material-symbols-outlined text-blue-400">verified</span>
<span class="text-xs font-bold uppercase tracking-widest text-blue-400">Compliance OK</span>
</div>
<p class="text-sm font-medium leading-snug">Todos los activos cumplen con la normativa MiFID II y ESG Nivel 1.</p>
</div>
</div>
</section>
<footer class="px-12 py-24 bg-surface-container-lowest border-t border-white/5">
<div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
<div class="col-span-1 md:col-span-2">
<h2 class="text-3xl font-bold mb-6">¿Preparado para diversificar su capital?</h2>
<p class="text-on-surface-variant max-w-md mb-8">Únase a una red exclusiva de inversores institucionales y acceda a oportunidades de Real Estate seleccionadas por expertos.</p>
<div class="flex gap-4">
<button class="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold">Contactar con un Advisor</button>
<button class="px-6 py-3 border border-outline-variant text-on-surface rounded-lg font-bold">Descargar Memoria Anual</button>
</div>
</div>
<div>
<h4 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Plataforma</h4>
<ul class="space-y-4 text-sm text-on-surface-variant">
<li><a class="hover:text-blue-400" href="#">Mercados Activos</a></li>
<li><a class="hover:text-blue-400" href="#">Gobernanza y Legal</a></li>
<li><a class="hover:text-blue-400" href="#">Reportes Trimestrales</a></li>
<li><a class="hover:text-blue-400" href="#">API para Partners</a></li>
</ul>
</div>
<div>
<h4 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Legal</h4>
<ul class="space-y-4 text-sm text-on-surface-variant">
<li><a class="hover:text-blue-400" href="#">Términos de Servicio</a></li>
<li><a class="hover:text-blue-400" href="#">Política de Privacidad</a></li>
<li><a class="hover:text-blue-400" href="#">Aviso de Riesgo</a></li>
<li><a class="hover:text-blue-400" href="#">Cookies</a></li>
</ul>
</div>
</div>
<div class="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
<p class="text-xs text-slate-500">© 2024 Plataforma Orquestadora Asset Management. Todos los derechos reservados.</p>
<div class="flex gap-6">
<span class="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">public</span>
<span class="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">business_center</span>
<span class="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">shield_with_heart</span>
</div>
</div>
</footer>
</main>

  `,
  styles: [`
    :host { display: block; overflow-x: hidden; background-color: #0b1326; }
    .glass-panel { background: rgba(34, 42, 61, 0.8); backdrop-filter: blur(12px); }
  `]
})
export class LandingInversor {
    public authService = inject(AuthService);
}
