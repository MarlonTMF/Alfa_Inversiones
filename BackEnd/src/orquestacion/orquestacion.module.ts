import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrquestacionControlador } from './presentation/controladores/orquestacion.controlador.js';
import { GestionarMercadoCasoUso } from './domain/casos-uso/gestionar-mercado.caso-uso.js';
import { ModificarEstadoProyectoCasoUso } from './domain/casos-uso/modificar-estado-proyecto.caso-uso.js';
import { AdminGuard } from './guards/admin.guard.js';
import { AutenticacionModule } from '../autenticacion/autenticacion.module.js';

@Module({
  // AutenticacionModule re-exporta JwtModule: lo necesita AdminGuard para
  // verificar el token de la cabecera Authorization.
  imports: [TypeOrmModule.forFeature([]), AutenticacionModule],
  controllers: [OrquestacionControlador],
  providers: [
    GestionarMercadoCasoUso,
    ModificarEstadoProyectoCasoUso,
    AdminGuard,
  ],
})
export class OrquestacionModule {}
