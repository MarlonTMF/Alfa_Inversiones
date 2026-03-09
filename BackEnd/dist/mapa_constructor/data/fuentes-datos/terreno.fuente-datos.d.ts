export declare class TerrenoFuenteDatos {
    id: string;
    ubicacion: string;
    precio: number;
    superficie: number;
    poligono_json: string;
    poligono: [number, number][];
    parsearPoligono(): void;
    serializarPoligono(): void;
}
