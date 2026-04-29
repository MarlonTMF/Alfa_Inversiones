import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminGuard } from '../../guards/admin.guard.js';
import { GestionarMercadoCasoUso } from '../../domain/casos-uso/gestionar-mercado.caso-uso.js';
import { ModificarEstadoProyectoCasoUso } from '../../domain/casos-uso/modificar-estado-proyecto.caso-uso.js';
import { ActualizarMercadoDto } from '../dto/mercado.dto.js';
import { EstadoProyectoDto } from '../dto/estado-proyecto.dto.js';

@Controller('orquestacion')
@UseGuards(AdminGuard)
export class OrquestacionControlador {
  constructor(
    private readonly gestionarMercadoCasoUso: GestionarMercadoCasoUso,
    private readonly modificarEstadoProyectoCasoUso: ModificarEstadoProyectoCasoUso,
  ) {}

  @Post('mercado')
  @HttpCode(HttpStatus.OK)
  async actualizarMercado(@Body() dto: ActualizarMercadoDto) {
    return this.gestionarMercadoCasoUso.upsertTendencias(dto);
  }

  @Patch('proyecto/:id/estado')
  @HttpCode(HttpStatus.OK)
  async modificarEstado(
    @Param('id') id: string,
    @Body() dto: EstadoProyectoDto,
  ) {
    return this.modificarEstadoProyectoCasoUso.ejecutar(id, dto);
  }
}
