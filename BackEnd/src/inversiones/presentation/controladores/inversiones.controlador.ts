import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegistrarInversionUseCase } from '../../domain/casos-uso/registrar-inversion.caso-uso.js';
import { CrearInversionDto } from '../dto/crear-inversion.dto.js';

@Controller('inversiones')
export class InversionesController {
  constructor(
    private readonly registrarInversionUseCase: RegistrarInversionUseCase,
  ) {}

  @Post('registrar')
  @UseInterceptors(FileInterceptor('archivo'))
  async registrar(
    @Body() dto: CrearInversionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.registrarInversionUseCase.ejecutar(dto, file);
  }

  @Get()
  async listar() {
    // Aquí podrías inyectar un GetInversionesUseCase si fuera necesario
    return { success: true, data: [] };
  }
}
