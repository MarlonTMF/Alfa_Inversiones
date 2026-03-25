import { Injectable, Inject } from '@nestjs/common';
import { PropertyRepository } from '../interfaces/property.repository.js';
import { PropertyFuenteDatos } from '../../data/fuentes-datos/property.fuente-datos.js';

/**
 * Caso de uso para obtener el listado de todas las propiedades.
 */
@Injectable()
export class GetAllPropertiesUseCase {
    constructor(
        @Inject('PropertyRepository')
        private readonly propertyRepository: PropertyRepository,
    ) { }

    /**
     * Ejecuta la consulta para obtener todas las propiedades.
     * @returns Un arreglo de propiedades registradas.
     */
    async execute(): Promise<PropertyFuenteDatos[]> {
        return await this.propertyRepository.findAll();
    }
}
