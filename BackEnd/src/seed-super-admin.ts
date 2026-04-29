import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RegistrarUsuarioCasoUso } from './autenticacion/domain/casos-uso/registrar-usuario.caso-uso.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const registrarUsuario = app.get(RegistrarUsuarioCasoUso);

  const superAdmin = {
    nombre: 'Súper Orquestador',
    rol: 'super-admin',
    email: 'superadmin@365soft.com',
    password: 'superadmin123',
  };

  try {
    await registrarUsuario.ejecutar(superAdmin);
    console.log(
      `\x1b[32m[SEED] Super Admin creado exitosamente: ${superAdmin.email}\x1b[0m`,
    );
  } catch (e: any) {
    if (e.message.includes('email ya está registrado')) {
      console.log(
        `\x1b[33m[SEED] El Super Admin ya existe: ${superAdmin.email}\x1b[0m`,
      );
    } else {
      console.error(
        `\x1b[31m[SEED] Error al crear Super Admin:\x1b[0m`,
        e.message,
      );
    }
  }

  await app.close();
}

bootstrap();
