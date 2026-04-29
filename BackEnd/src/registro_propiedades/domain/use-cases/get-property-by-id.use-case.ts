import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../interfaces/property.repository.js';
import { PropertyFuenteDatos } from '../../data/fuentes-datos/property.fuente-datos.js';

/**
 * Caso de uso para obtener una propiedad por su identificador único.
 */
@Injectable()
export class GetPropertyByIdUseCase {
  constructor(
    @Inject('PropertyRepository')
    private readonly propertyRepository: PropertyRepository,
  ) {}

  /**
   * Busca una propiedad por ID. Lanza una excepción si no se encuentra.
   * @param id El identificador de la propiedad.
   * @returns La propiedad encontrada con sus relaciones.
   */
  async execute(id: string): Promise<PropertyFuenteDatos> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
    }

    return property;
  }
}
