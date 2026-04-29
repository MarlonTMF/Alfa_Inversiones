import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard } from '../../../orquestacion/guards/admin.guard.js';
import { CrearProyectoCasoUso } from '../../domain/use-cases/crear-proyecto.caso-uso.js';
import { GetProyectosCasoUso } from '../../domain/use-cases/get-proyectos.caso-uso.js';
import { GetProyectoPorIdCasoUso } from '../../domain/use-cases/get-proyecto-por-id.caso-uso.js';
import { GetProyectosPorEstadoCasoUso } from '../../domain/use-cases/get-proyectos-por-estado.caso-uso.js';
import { GetProyectoPorPropertyIdCasoUso } from '../../domain/use-cases/get-proyecto-por-property-id.caso-uso.js';
import { GetProyectosPorConstructorIdCasoUso } from '../../domain/use-cases/get-proyectos-por-constructor-id.caso-uso.js';
import { GetProyectoDashboardCasoUso } from '../../domain/use-cases/get-proyecto-dashboard.caso-uso.js';
import { ActualizarProyectoCasoUso } from '../../domain/use-cases/actualizar-proyecto.caso-uso.js';
import { EliminarProyectoCasoUso } from '../../domain/use-cases/eliminar-proyecto.caso-uso.js';
import { CrearProyectoFaseCasoUso } from '../../domain/use-cases/crear-proyecto-fase.caso-uso.js';
import { GetProyectoFasesCasoUso } from '../../domain/use-cases/get-proyecto-fases.caso-uso.js';
import { CrearProyectoMetricaCasoUso } from '../../domain/use-cases/crear-proyecto-metrica.caso-uso.js';
import { GetProyectoMetricasCasoUso } from '../../domain/use-cases/get-proyecto-metricas.caso-uso.js';
import { GetUltimaMetricaCasoUso } from '../../domain/use-cases/get-ultima-metrica.caso-uso.js';
import { CrearProyectoDocumentoCasoUso } from '../../domain/use-cases/crear-proyecto-documento.caso-uso.js';
import { GetProyectoDocumentosCasoUso } from '../../domain/use-cases/get-proyecto-documentos.caso-uso.js';
import { CrearProyectoDto } from '../dto/crear-proyecto.dto.js';
import { ActualizarProyectoDto } from '../dto/actualizar-proyecto.dto.js';
import { CrearProyectoFaseDto } from '../dto/crear-proyecto-fase.dto.js';
import { CrearProyectoMetricaDto } from '../dto/crear-proyecto-metrica.dto.js';
import { CrearProyectoDocumentoDto } from '../dto/crear-proyecto-documento.dto.js';

@Controller('proyectos')
@UseGuards(AdminGuard)
export class ProyectosControlador {
  constructor(
    private readonly crearProyectoCasoUso: CrearProyectoCasoUso,
    private readonly getProyectosCasoUso: GetProyectosCasoUso,
    private readonly getProyectoPorIdCasoUso: GetProyectoPorIdCasoUso,
    private readonly getProyectosPorEstadoCasoUso: GetProyectosPorEstadoCasoUso,
    private readonly getProyectoPorPropertyIdCasoUso: GetProyectoPorPropertyIdCasoUso,
    private readonly getProyectosPorConstructorIdCasoUso: GetProyectosPorConstructorIdCasoUso,
    private readonly getProyectoDashboardCasoUso: GetProyectoDashboardCasoUso,
    private readonly actualizarProyectoCasoUso: ActualizarProyectoCasoUso,
    private readonly eliminarProyectoCasoUso: EliminarProyectoCasoUso,
    private readonly crearProyectoFaseCasoUso: CrearProyectoFaseCasoUso,
    private readonly getProyectoFasesCasoUso: GetProyectoFasesCasoUso,
    private readonly crearProyectoMetricaCasoUso: CrearProyectoMetricaCasoUso,
    private readonly getProyectoMetricasCasoUso: GetProyectoMetricasCasoUso,
    private readonly getUltimaMetricaCasoUso: GetUltimaMetricaCasoUso,
    private readonly crearProyectoDocumentoCasoUso: CrearProyectoDocumentoCasoUso,
    private readonly getProyectoDocumentosCasoUso: GetProyectoDocumentosCasoUso,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearProyectoDto, @Req() req: Request) {
    const creatorId = (req as unknown as { user?: { id?: string } }).user?.id;
    return this.crearProyectoCasoUso.ejecutar(dto, creatorId);
  }

  @Get()
  async listar() {
    return this.getProyectosCasoUso.ejecutar();
  }

  @Get('estado/:estado')
  async listarPorEstado(@Param('estado') estado: string) {
    return this.getProyectosPorEstadoCasoUso.ejecutar(estado);
  }

  @Get('property/:propertyId')
  async obtenerPorPropertyId(@Param('propertyId') propertyId: string) {
    return this.getProyectoPorPropertyIdCasoUso.ejecutar(propertyId);
  }

  @Get('constructor/:constructorId')
  async listarPorConstructorId(@Param('constructorId') constructorId: string) {
    return this.getProyectosPorConstructorIdCasoUso.ejecutar(constructorId);
  }

  @Get(':id')
  async obtener(@Param('id') id: string) {
    return this.getProyectoPorIdCasoUso.ejecutar(id);
  }

  @Get(':id/dashboard')
  async dashboard(@Param('id') proyectoId: string) {
    return this.getProyectoDashboardCasoUso.ejecutar(proyectoId);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarProyectoDto,
  ) {
    return this.actualizarProyectoCasoUso.ejecutar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminar(@Param('id') id: string) {
    return this.eliminarProyectoCasoUso.ejecutar(id);
  }

  @Post(':id/fases')
  @HttpCode(HttpStatus.CREATED)
  async crearFase(
    @Param('id') proyectoId: string,
    @Body() dto: CrearProyectoFaseDto,
  ) {
    return this.crearProyectoFaseCasoUso.ejecutar(proyectoId, dto);
  }

  @Get(':id/fases')
  async listarFases(@Param('id') proyectoId: string) {
    return this.getProyectoFasesCasoUso.ejecutar(proyectoId);
  }

  @Post(':id/metricas')
  @HttpCode(HttpStatus.CREATED)
  async crearMetrica(
    @Param('id') proyectoId: string,
    @Body() dto: CrearProyectoMetricaDto,
  ) {
    return this.crearProyectoMetricaCasoUso.ejecutar(proyectoId, dto);
  }

  @Get(':id/metricas')
  async listarMetricas(@Param('id') proyectoId: string) {
    return this.getProyectoMetricasCasoUso.ejecutar(proyectoId);
  }

  @Get(':id/metricas/ultima')
  async obtenerUltimaMetrica(@Param('id') proyectoId: string) {
    return this.getUltimaMetricaCasoUso.ejecutar(proyectoId);
  }

  @Post(':id/documentos')
  @HttpCode(HttpStatus.CREATED)
  async crearDocumento(
    @Param('id') proyectoId: string,
    @Body() dto: CrearProyectoDocumentoDto,
  ) {
    return this.crearProyectoDocumentoCasoUso.ejecutar(proyectoId, dto);
  }

  @Get(':id/documentos')
  async listarDocumentos(@Param('id') proyectoId: string) {
    return this.getProyectoDocumentosCasoUso.ejecutar(proyectoId);
  }
}
