import { PropertyFuenteDatos } from '../../data/fuentes-datos/property.fuente-datos.js';

/**
 * Clase abstracta para el repositorio de propiedades.
 * Definimos esto como clase abstracta en lugar de interfaz para que NestJS
 * pueda usarlo como token de inyección y evitar errores de metadatos de TypeScript.
 */
export abstract class PropertyRepository {
    /**
     * Crea una nueva propiedad en la base de datos.
     * @param property Los datos de la propiedad a crear.
     * @returns Una promesa que se resuelve con la propiedad creada.
     */
    abstract create(property: Partial<PropertyFuenteDatos>): Promise<PropertyFuenteDatos>;

    /**
     * Busca una propiedad por su ID.
     * @param id El identificador único de la propiedad.
     * @returns Una promesa que se resuelve con la propiedad encontrada o null.
     */
    abstract findById(id: string): Promise<PropertyFuenteDatos | null>;

    /**
     * Obtiene todas las propiedades registradas.
     * @returns Una promesa que se resuelve con un arreglo de propiedades.
     */
    abstract findAll(): Promise<PropertyFuenteDatos[]>;
}
