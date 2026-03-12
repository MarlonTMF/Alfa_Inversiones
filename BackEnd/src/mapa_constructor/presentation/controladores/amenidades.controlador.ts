import { Controller, Get, Query } from '@nestjs/common';
import { ObtenerAmenidadesCasoUso } from '../../domain/casos-uso/obtener-amenidades.caso-uso.js';
import { ConsultaAmenidadesDto } from '../dto/consulta-amenidades.dto.js';
import { AmenidadRespuestaDto } from '../dto/amenidad-respuesta.dto.js';

@Controller('amenidades')
export class AmenidadesControlador {
  constructor(private readonly obtenerAmenidades: ObtenerAmenidadesCasoUso) {}

  @Get()
  async listar(
    @Query() consulta: ConsultaAmenidadesDto,
  ): Promise<AmenidadRespuestaDto[]> {
    return this.obtenerAmenidades.ejecutar(consulta);
  }
}
