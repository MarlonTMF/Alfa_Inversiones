export class TerrenoRespuestaDto {
  id: string;
  ubicacion: string;
  precio: number;
  superficie: number;
  departamento?: string;
  estado?: string;
  uso_suelo?: string;
  poligono: [number, number][];
  portada?: string;
}
