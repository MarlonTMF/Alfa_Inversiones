import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../domain/use-cases/create-property.use-case.js';
import { GetAllPropertiesUseCase } from '../../domain/use-cases/get-all-properties.use-case.js';
import { GetPropertyByIdUseCase } from '../../domain/use-cases/get-property-by-id.use-case.js';
import { CreatePropertyDto } from '../dto/create-property.dto.js';
import { PropertyFuenteDatos } from '../../data/fuentes-datos/property.fuente-datos.js';

/**
 * Controlador para la gestión de propiedades.
 * Define las rutas y maneja las peticiones HTTP entrantes.
 */
@Controller('properties')
export class PropertyController {
    constructor(
        private readonly createPropertyUseCase: CreatePropertyUseCase,
        private readonly getAllPropertiesUseCase: GetAllPropertiesUseCase,
        private readonly getPropertyByIdUseCase: GetPropertyByIdUseCase,
    ) { }

    /**
     * Endpoint para registrar una nueva propiedad.
     */
    @Post()
    async create(@Body() createPropertyDto: CreatePropertyDto): Promise<PropertyFuenteDatos> {
        return await this.createPropertyUseCase.execute(createPropertyDto);
    }

    /**
     * Endpoint para obtener todas las propiedades.
     */
    @Get()
    async findAll(): Promise<PropertyFuenteDatos[]> {
        return await this.getAllPropertiesUseCase.execute();
    }

    /**
     * Endpoint para obtener una propiedad por su ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PropertyFuenteDatos> {
        return await this.getPropertyByIdUseCase.execute(id);
    }
}
