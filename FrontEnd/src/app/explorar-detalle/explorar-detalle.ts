import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';
import { PublicNavbar } from '../layout/public-navbar/public-navbar';

@Component({
  selector: 'app-explorar-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, Login, PublicNavbar],
  templateUrl: './explorar-detalle.html',
  styleUrl: './explorar-detalle.css'
})
export class ExplorarDetalle implements OnInit {
    public authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    
    public mostrarLogin: boolean = false;

    // Datos base (pueden ser sobreescritos por ID)
    proyecto: any = {
        nombre: 'Complejo Calacoto Business',
        ubicacion: 'Calacoto, La Paz',
        capitalAsignado: 42.8,
        capitalTotal: 52.0,
        progreso: 82,
        imagen: '/images/proyecto_equipetrol.webp',
        roi: '18.4%',
        yield: '8.5%',
        periodo: '5 Años',
        ltv: '62.0%',
        kpis: [
            { label: 'ROI Objetivo', value: '18.4%', sub: 'Tasa Interna de Retorno Anualizada', icon: 'trending_up' },
            { label: 'Rendimiento Proyectado', value: '8.5%', sub: 'Distribución Trimestral Estimada', icon: 'payments' },
            { label: 'Periodo de Retención', value: '5 Años', sub: 'Liquidación de Activos Programada', icon: 'event_repeat' },
            { label: 'Ratio LTV', value: '62.0%', sub: 'Estructura de Apalancamiento', icon: 'account_balance' }
        ]
    };

    pulse = [
        {
            titulo: 'Structural Phase IV Complete',
            tiempo: '2 hours ago',
            desc: 'External curtain wall installation finalized for floors 12-18. Engineering sign-off obtained for primary HVAC load-balancing units.',
            icon: 'engineering'
        },
        {
            titulo: 'Lease Agreement: Global Tech Anchor',
            tiempo: 'Yesterday',
            desc: 'Letter of Intent signed for 45,000 sq ft of premium office space. Anchoring lease secures 12% of total project revenue.',
            icon: 'description'
        },
        {
            titulo: 'BREEAM Excellence Certification',
            tiempo: '3 days ago',
            desc: "Interim audit confirms 'Outstanding' rating for energy efficiency and sustainable material sourcing.",
            icon: 'verified_user'
        }
    ];

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        
        // Caso especial solicitado por el usuario
        if (id === '411adf42-1222-4c98-8818-2c989aab7475') {
            this.proyecto = {
                nombre: 'Residencias Calacoto',
                ubicacion: 'Calacoto, La Paz - Bolivia',
                capitalAsignado: 0.44,
                capitalTotal: 0.44,
                progreso: 100,
                imagen: '/residencias-calacoto.png',
                roi: '12.5%',
                yield: '7.2%',
                periodo: '3 Años',
                ltv: '0%',
                kpis: [
                    { label: 'Precio Solicitado', value: '$440,000', sub: 'Valor total del activo', icon: 'payments' },
                    { label: 'Superficie Total', value: '400 m²', sub: 'Área de terreno disponible', icon: 'square_foot' },
                    { label: 'Precio por m²', value: '$1,100', sub: 'Costo unitario de mercado', icon: 'analytics' },
                    { label: 'Topografía', value: 'Plana (100%)', sub: 'Estado del terreno', icon: 'landscape' }
                ]
            };

            this.pulse = [
                {
                    titulo: 'Activo Validado',
                    tiempo: 'Reciente',
                    desc: 'El terreno en Calacoto ha sido validado técnica y legalmente por nuestro equipo de expertos.',
                    icon: 'verified_user'
                }
            ];
        }
    }

    procesarLogin({ usuario, token }: { usuario: any; token?: string }): void {
        this.authService.login(usuario, token);
        this.mostrarLogin = false;
        this.redireccionarSegunRol(usuario);
    }

    private redireccionarSegunRol(usuario: any): void {
        const rol = (usuario.rol || '').toLowerCase();
        if (rol === 'inversor' || rol === 'inversionista') {
            this.router.navigate(['/mapa']);
        } else if (rol === 'constructor') {
            this.router.navigate(['/constructor']);
        } else if (rol === 'admin' || rol === 'super-admin') {
            this.router.navigate(['/admin/dashboard']);
        } else {
            this.router.navigate(['/mapa']);
        }
    }
}
