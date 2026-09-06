import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicNavbar } from '../../layout/public-navbar/public-navbar';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-landing-terreno',
  standalone: true,
  imports: [CommonModule, PublicNavbar],
  template: `
<app-public-navbar></app-public-navbar>

<main class="relative">
<section class="relative min-h-[921px] flex items-center overflow-hidden">
<div class="absolute inset-0 z-0">
<img alt="" class="w-full h-full object-cover opacity-40 mix-blend-luminosity" src="/images/terreno_urubo.webp"/>
<div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
</div>
<div class="container mx-auto px-12 relative z-10 grid grid-cols-12 gap-8">
<div class="col-span-12 lg:col-span-7">
<span class="inline-block mb-6 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-blue-400 text-[0.6875rem] font-bold uppercase tracking-[0.1em]">Red LINK para Propietarios</span>
<h1 class="text-[3.5rem] font-bold leading-[1.1] tracking-tight text-on-surface mb-8">
                        Monetice su Terreno con la <span class="text-blue-500">Red LINK</span>
</h1>
<p class="text-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
                        Transformamos su patrimonio en una oportunidad de inversión institucional. Acceda a una valorización experta y conecte con los constructores de élite del mercado global.
                    </p>
<div class="flex items-center gap-6">
<button class="bg-brand text-white px-8 py-4 rounded-lg font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                            Registrar Propiedad
                        </button>
<button class="flex items-center gap-2 text-blue-400 font-semibold group">
<span>Saber más sobre el proceso</span>
<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>
<section class="py-24 px-12 bg-surface-container-lowest">
<div class="container mx-auto">
<div class="mb-16 text-center max-w-2xl mx-auto">
<h2 class="text-[1.75rem] font-semibold mb-4 text-on-surface">Valorización Estratégica y Redes de Élite</h2>
<p class="text-on-surface-variant">Unimos la precisión técnica del análisis de activos con el alcance global de una red de construcción de primer nivel.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[500px]">
<div class="md:col-span-8 bg-surface-container-low rounded-xl p-10 flex flex-col justify-between overflow-hidden relative group">
<div class="relative z-10">
<h3 class="text-2xl font-bold text-on-surface mb-4">Valorización de Activos (Asset Valuation)</h3>
<p class="text-on-surface-variant max-w-md">Utilizamos algoritmos de IA y análisis geoespacial para determinar el valor máximo de mercado de su terreno en tiempo real.</p>
</div>
<div class="relative z-10 mt-8 grid grid-cols-3 gap-4">
<div class="p-4 bg-surface-container-high rounded-lg">
<span class="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Precisión</span>
<span class="text-xl font-bold text-on-surface">99.4%</span>
</div>
<div class="p-4 bg-surface-container-high rounded-lg">
<span class="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Métricas</span>
<span class="text-xl font-bold text-on-surface">+450</span>
</div>
</div>
<img alt="" class="absolute right-0 bottom-0 w-1/2 h-2/3 object-contain opacity-20 group-hover:opacity-40 transition-opacity" src="/images/terreno_warnes.webp"/>
</div>
<div class="md:col-span-4 bg-surface-container-high rounded-xl p-10 flex flex-col justify-end relative overflow-hidden group">
<div class="absolute inset-0">
<img alt="" class="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="/images/mercado_regional_map.webp"/>
</div>
<div class="relative z-10">
<span class="material-symbols-outlined text-4xl text-blue-500 mb-6" data-icon="handshake">handshake</span>
<h3 class="text-xl font-bold text-on-surface mb-2">Conexión con Constructores Élite</h3>
<p class="text-sm text-on-surface-variant">Acceso directo a las firmas de construcción y desarrolladores más prestigiosos del mundo.</p>
</div>
</div>
</div>
</div>
</section>
<section class="py-32 px-12 bg-surface">
<div class="container mx-auto">
<div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
<div class="relative">
<div class="text-[5rem] font-black text-blue-500/10 absolute -top-12 -left-4">01</div>
<div class="relative z-10">
<span class="text-[0.6875rem] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Fase Inicial</span>
<h4 class="text-xl font-bold text-on-surface mb-4">Registro Digital</h4>
<p class="text-on-surface-variant leading-relaxed">Cargue las coordenadas y documentación legal de su propiedad en nuestra plataforma segura e institucional.</p>
</div>
<div class="mt-8 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-blue-600 w-1/3"></div>
</div>
</div>
<div class="relative">
<div class="text-[5rem] font-black text-blue-500/10 absolute -top-12 -left-4">02</div>
<div class="relative z-10">
<span class="text-[0.6875rem] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Análisis Técnico</span>
<h4 class="text-xl font-bold text-on-surface mb-4">Evaluación Red LINK</h4>
<p class="text-on-surface-variant leading-relaxed">Nuestros expertos realizan un due-diligence técnico y comercial para validar el potencial del activo.</p>
</div>
<div class="mt-8 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-blue-600 w-2/3"></div>
</div>
</div>
<div class="relative">
<div class="text-[5rem] font-black text-blue-500/10 absolute -top-12 -left-4">03</div>
<div class="relative z-10">
<span class="text-[0.6875rem] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Ejecución</span>
<h4 class="text-xl font-bold text-on-surface mb-4">Alianza Estratégica</h4>
<p class="text-on-surface-variant leading-relaxed">Presentamos su terreno a inversores cualificados y facilitamos el cierre de la transacción.</p>
</div>
<div class="mt-8 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-blue-600 w-full"></div>
</div>
</div>
</div>
</div>
</section>
<section class="py-24 px-12">
<div class="container mx-auto">
<div class="glass-card rounded-2xl p-16 relative overflow-hidden border border-outline-variant/10">
<div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
<div class="max-w-xl text-center md:text-left">
<h2 class="text-[2.5rem] font-bold text-on-surface mb-6 leading-tight">¿Listo para maximizar el valor de su tierra?</h2>
<p class="text-lg text-on-surface-variant">Únase a la red de propietarios más exclusiva y convierta su terreno en un proyecto de legado mundial.</p>
</div>
<div class="flex flex-col items-center gap-4">
<button class="bg-brand text-white text-lg px-12 py-5 rounded-lg font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-blue-500/40">
                                Registrar Mi Propiedad Ahora
                            </button>
<span class="text-[0.6875rem] text-on-surface-variant uppercase tracking-widest font-bold">Sin costos iniciales por evaluación</span>
</div>
</div>
<div class="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
<div class="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full"></div>
</div>
</div>
</section>
</main>
<footer class="bg-surface-container-lowest py-12 px-12 border-t border-outline-variant/5">
<div class="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
<div class="col-span-1 md:col-span-2">
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-blue-500" data-icon="account_balance">account_balance</span>
<span class="text-xl font-bold tracking-tighter text-blue-500 font-['Inter']">LINK</span>
</div>
<p class="text-on-surface-variant max-w-sm text-sm">Plataforma institucional líder en la gestión y monetización de activos inmobiliarios de alto valor. Seguridad, transparencia y red de élite.</p>
</div>
<div>
<h5 class="text-xs font-bold text-on-surface uppercase tracking-widest mb-6">Plataforma</h5>
<ul class="space-y-4 text-sm text-on-surface-variant">
<li><a class="hover:text-blue-400 transition-colors" href="#">Dashboard de Propietarios</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Calculadora de Valor</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Red de Constructores</a></li>
</ul>
</div>
<div>
<h5 class="text-xs font-bold text-on-surface uppercase tracking-widest mb-6">Legal</h5>
<ul class="space-y-4 text-sm text-on-surface-variant">
<li><a class="hover:text-primary transition-colors" href="#">Privacidad Institucional</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Términos de Servicio</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Cumplimiento Normativo</a></li>
</ul>
</div>
</div>
<div class="container mx-auto mt-20 pt-8 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
<p>© LINK · Inteligencia Inmobiliaria. Todos los derechos reservados.</p>
<p>Acceso Restringido a Usuarios Autorizados</p>
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
export class LandingTerreno {
    public authService = inject(AuthService);
}
