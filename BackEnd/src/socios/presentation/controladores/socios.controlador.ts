import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { RegistrarSocioUseCase } from '../../domain/casos-uso/registrar-socio.caso-uso.js';
import { GetSociosUseCase } from '../../domain/casos-uso/get-socios.caso-uso.js';
import { RegistrarSocioDto } from '../dto/registrar-socio.dto.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('socios')
export class SociosController {
  constructor(
    private readonly registrarSocioUseCase: RegistrarSocioUseCase,
    private readonly getSociosUseCase: GetSociosUseCase,
  ) {}

  @Get()
  async listar() {
    return this.getSociosUseCase.ejecutar();
  }

  @Post('registrar')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'testimonio', maxCount: 1 },
      { name: 'padron', maxCount: 1 },
    ]),
  )
  async registrar(
    @Body() dto: RegistrarSocioDto,
    @UploadedFiles()
    files: {
      testimonio?: Express.Multer.File[];
      padron?: Express.Multer.File[];
    },
  ) {
    return this.registrarSocioUseCase.ejecutar(dto, files);
  }
}
