import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../interfaces/property.repository.js';
import { PropertyFuenteDatos } from '../../data/fuentes-datos/property.fuente-datos.js';

/**
 * Caso de uso para actualizar campos parciales de una propiedad.
 * El Frontend puede mandar solo el campo que cambió (PATCH semántica).
 */
@Injectable()
export class UpdatePropertyUseCase {
    constructor(
        @Inject('PropertyRepository')
        private readonly propertyRepository: PropertyRepository,
    ) { }

    async execute(id: string, data: Partial<PropertyFuenteDatos>): Promise<void> {
        const property = await this.propertyRepository.findById(id);

        if (!property) {
            throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
        }

        await this.propertyRepository.update(id, data);
    }
}
