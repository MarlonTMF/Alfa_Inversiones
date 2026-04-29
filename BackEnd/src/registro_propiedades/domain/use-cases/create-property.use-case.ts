import { Injectable, Inject } from '@nestjs/common';
import { PropertyRepository } from '../interfaces/property.repository.js';
import { PropertyFuenteDatos } from '../../data/fuentes-datos/property.fuente-datos.js';

/**
 * Caso de uso para la creación de propiedades.
 * Se encarga de la lógica de negocio relacionada con el registro de nuevas propiedades.
 */
@Injectable()
export class CreatePropertyUseCase {
  constructor(
    /**
     * Inyección del repositorio de propiedades.
     * Se utiliza la interfaz para desacoplar de la implementación concreta.
     */
    @Inject('PropertyRepository')
    private readonly propertyRepository: PropertyRepository,
  ) {}

  /**
   * Ejecuta la lógica para crear una nueva propiedad.
   * @param propertyData Datos de la propiedad a registrar.
   * @returns Una promesa que resuelve con la propiedad creada.
   */
  async execute(
    propertyData: Partial<PropertyFuenteDatos>,
  ): Promise<PropertyFuenteDatos> {
    // En un futuro se pueden agregar validaciones aquí.
    return this.propertyRepository.create(propertyData);
  }
}
