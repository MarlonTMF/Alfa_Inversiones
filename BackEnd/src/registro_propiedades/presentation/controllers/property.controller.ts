import { Controller, Post, Body, Get, Param, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePropertyUseCase } from '../../domain/use-cases/create-property.use-case.js';
import { GetAllPropertiesUseCase } from '../../domain/use-cases/get-all-properties.use-case.js';
import { GetPropertyByIdUseCase } from '../../domain/use-cases/get-property-by-id.use-case.js';
import { GetPropertyAnalysisUseCase } from '../../domain/use-cases/get-property-analysis.use-case.js';
import { UpdatePropertyUseCase } from '../../domain/use-cases/update-property.use-case.js';
import { RegisterFullPropertyUseCase } from '../../domain/use-cases/register-full-property.use-case.js';
import { CreatePropertyDto } from '../dto/create-property.dto.js';
import { RegisterFullPropertyDto } from '../dto/register-full-property.dto.js';
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
        private readonly getPropertyAnalysisUseCase: GetPropertyAnalysisUseCase,
        private readonly updatePropertyUseCase: UpdatePropertyUseCase,
        private readonly registerFullPropertyUseCase: RegisterFullPropertyUseCase,
    ) { }

    /**
     * Endpoint para el registro completo (Terreno + Propietario).
     */
    @Post('register-full')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'folioReal', maxCount: 1 },
        { name: 'catastro', maxCount: 1 },
        { name: 'multimedia', maxCount: 50 },
        { name: 'adicional', maxCount: 10 },
    ]))
    async registerFull(
        @Body() dto: RegisterFullPropertyDto,
        @UploadedFiles() files: { 
            folioReal?: Express.Multer.File[], 
            catastro?: Express.Multer.File[], 
            multimedia?: Express.Multer.File[],
            adicional?: Express.Multer.File[] 
        }
    ): Promise<any> {
        return await this.registerFullPropertyUseCase.execute(dto, files);
    }

    /**
     * Endpoint para registrar una nueva propiedad.
     */
    @Post()
    async create(@Body() createPropertyDto: CreatePropertyDto): Promise<any> {
        try {
            return await this.createPropertyUseCase.execute(createPropertyDto);
        } catch (error: any) {
            console.error("CREATE ERROR:", error);
            return {
                diagnostico: "DB_ERROR",
                message: error.message,
                detail: error.detail ? error.detail : error,
            };
        }
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

    /**
     * Endpoint para obtener el análisis financiero de una propiedad.
     */
    @Get(':id/analysis')
    async getAnalysis(@Param('id') id: string): Promise<any> {
        return await this.getPropertyAnalysisUseCase.execute(id);
    }

    /**
     * Endpoint para actualizar campos parciales de una propiedad (Admin).
     * El Frontend manda solo el campo que cambió.
     */
    @Patch(':id')
    async updateProperty(
        @Param('id') id: string,
        @Body() data: Partial<PropertyFuenteDatos>
    ): Promise<{ mensaje: string }> {
        await this.updatePropertyUseCase.execute(id, data);
        return { mensaje: 'Propiedad actualizada correctamente' };
    }
}
