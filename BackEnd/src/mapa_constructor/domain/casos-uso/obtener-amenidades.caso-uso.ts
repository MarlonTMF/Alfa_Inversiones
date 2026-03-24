import { Inject, Injectable } from '@nestjs/common';
import type { AmenidadRepositorio } from '../interfaces/amenidad.repositorio.js';
import { AMENIDAD_REPOSITORIO } from '../interfaces/amenidad.repositorio.js';
import { ConsultaAmenidadesDto } from '../../presentation/dto/consulta-amenidades.dto.js';
import { AmenidadRespuestaDto } from '../../presentation/dto/amenidad-respuesta.dto.js';

@Injectable()
export class ObtenerAmenidadesCasoUso {
  constructor(
    @Inject(AMENIDAD_REPOSITORIO)
    private readonly amenidadRepositorio: AmenidadRepositorio,
  ) {}

  async ejecutar(
    consulta: ConsultaAmenidadesDto,
  ): Promise<AmenidadRespuestaDto[]> {
    return this.amenidadRepositorio.buscarPorRadio(consulta);
  }
}
