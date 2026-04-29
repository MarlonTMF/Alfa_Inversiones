export class RespuestaLoginDto {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    rol: string;
    email: string;
  };
}
