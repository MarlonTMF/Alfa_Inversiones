export class TerrenoRespuestaDto {
  id: string;
  ubicacion: string;
  precio: number;
  superficie: number;
  departamento?: string;
  poligono: [number, number][];
}
