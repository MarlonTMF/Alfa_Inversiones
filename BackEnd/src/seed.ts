import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CrearTerrenoCasoUso } from './mapa_constructor/domain/casos-uso/crear-terreno.caso-uso';
import * as crypto from 'crypto';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const crearTerreno = app.get(CrearTerrenoCasoUso);

    const ejemplos = [
        {
            id: crypto.randomUUID(),
            ubicacion: 'Cabañas del Piraí',
            precio: 450000,
            superficie: 800,
            departamento: 'Santa Cruz',
            poligono: [
                [-17.785, -63.220],
                [-17.785, -63.222],
                [-17.787, -63.222],
                [-17.787, -63.220],
                [-17.785, -63.220]
            ] as [number, number][]
        },
        {
            id: crypto.randomUUID(),
            ubicacion: 'Calacoto Calle 15',
            precio: 620000,
            superficie: 500,
            departamento: 'La Paz',
            poligono: [
                [-16.540, -68.085],
                [-16.540, -68.087],
                [-16.542, -68.087],
                [-16.542, -68.085],
                [-16.540, -68.085]
            ] as [number, number][]
        },
        {
            id: crypto.randomUUID(),
            ubicacion: 'Av. Banzer 4to Anillo',
            precio: 350000,
            superficie: 600,
            departamento: 'Santa Cruz',
            poligono: [
                [-17.745, -63.170],
                [-17.745, -63.172],
                [-17.747, -63.172],
                [-17.747, -63.170],
                [-17.745, -63.170]
            ] as [number, number][]
        },
        {
            id: crypto.randomUUID(),
            ubicacion: 'Sopocachi Plaza España',
            precio: 280000,
            superficie: 400,
            departamento: 'La Paz',
            poligono: [
                [-16.510, -68.125],
                [-16.510, -68.127],
                [-16.512, -68.127],
                [-16.512, -68.125],
                [-16.510, -68.125]
            ] as [number, number][]
        }
    ];

    for (const terreno of ejemplos) {
        try {
            await crearTerreno.ejecutar(terreno);
            console.log(`Terreno creado: ${terreno.ubicacion}`);
        } catch (e: any) {
            console.error(`Error al crear ${terreno.ubicacion}:`, e.message);
        }
    }

    await app.close();
}

bootstrap();
