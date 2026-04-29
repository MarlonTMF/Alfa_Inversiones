import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../interfaces/property.repository.js';

/**
 * Caso de uso para obtener el análisis financiero de una propiedad.
 * Mapea los datos de la base de datos al formato requerido por el dashboard.
 */
@Injectable()
export class GetPropertyAnalysisUseCase {
  constructor(
    @Inject('PropertyRepository')
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async execute(id: string): Promise<any> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);
    }

    // Mapeo selectivo al formato que espera el Dashboard del Frontend
    return {
      id: property.id,
      ciudad: property.city || 'No especificado',
      distrito: property.district || 'No especificado',
      uv: property.uv || 'N/A',
      direccion: property.exactAddress || 'Dirección no registrada',
      lat: property.lat || null,
      lng: property.lng || null,
      roi: Number(property.projectedRoi) || 0,
      incidencia: Number(property.landIncidence) || 0,
      construccionM2: Number(property.constructionCostSqm) || 0,
      capacidadNiveles: property.allowedFloors || 0,
      adquisicionTotal: Number(property.basePriceNegotiation) || 0,
      tamanoM2: Number(property.totalArea) || 0,
      precioM2Terreno: Number(property.pricePerM2) || 0,
      asesorVision:
        property.advisorVision ||
        'Sin visión estratégica registrada por el momento.',
      // Array completo de multimedia (imágenes + videos) para el carrusel
      multimedia: (property.multimedia || []).map((m) => ({
        id: m.id,
        type: m.type,
        provider: m.provider,
        url: m.url,
        publicId: m.publicId,
        isMain: m.isMain,
        label: m.label,
        thumbnailUrl: (m as any).thumbnailUrl || null,
      })),
    };
  }
}
