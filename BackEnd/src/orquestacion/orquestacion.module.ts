import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrquestacionControlador } from './presentation/controladores/orquestacion.controlador.js';
import { GestionarMercadoCasoUso } from './domain/casos-uso/gestionar-mercado.caso-uso.js';
import { ModificarEstadoProyectoCasoUso } from './domain/casos-uso/modificar-estado-proyecto.caso-uso.js';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [OrquestacionControlador],
  providers: [GestionarMercadoCasoUso, ModificarEstadoProyectoCasoUso],
})
export class OrquestacionModule { }
