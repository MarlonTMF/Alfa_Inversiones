import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth';
import { Login } from '../auth/login/login';
import { PublicNavbar } from '../layout/public-navbar/public-navbar';

interface FAQ {
  pregunta: string;
  respuesta: string;
  abierto: boolean;
}

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, Login, PublicNavbar],
  templateUrl: './ayuda.html',
  styleUrl: './ayuda.css'
})
export class Ayuda {
  preguntasFrecuentes: FAQ[] = [
    {
      pregunta: '¿Cómo funciona la inversión por permuta?',
      respuesta: 'Es un modelo donde usted aporta su terreno y, a cambio, recibe metros cuadrados construidos (departamentos, locales o casas) una vez finalizado el proyecto, asegurando una alta rentabilidad y plusvalía.',
      abierto: true
    },
    {
      pregunta: '¿Qué seguridad tengo sobre mi terreno?',
      respuesta: 'Todo el proceso está respaldado por fideicomisos y contratos notariados. Realizamos una estricta validación legal y financiera a todas las constructoras antes de permitirles operar en nuestra plataforma.',
      abierto: false
    },
    {
      pregunta: 'Soy constructora, ¿cómo puedo fondear mis proyectos?',
      respuesta: 'Debe registrar su empresa en nuestra plataforma. Tras pasar nuestra auditoría de due diligence, podrá publicar sus proyectos en nuestro Mapa de Activos para recibir propuestas de inversión o terrenos en aportación.',
      abierto: false
    },
    {
      pregunta: '¿Cuánto tiempo tarda en aprobarse un proyecto?',
      respuesta: 'El proceso de auditoría y validación legal toma entre 5 a 10 días hábiles una vez entregada toda la documentación requerida a través de su panel de control.',
      abierto: false
    }
  ];

  public authService = inject(AuthService);
  public mostrarLogin = false;

  togglePregunta(index: number): void {
    this.preguntasFrecuentes[index].abierto = !this.preguntasFrecuentes[index].abierto;
  }

  procesarLogin() {
    this.mostrarLogin = false;
  }
}