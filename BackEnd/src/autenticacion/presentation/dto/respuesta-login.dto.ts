export class RespuestaLoginDto {
  token: string;
  usuario: {
    nombre: string;
    rol: string;
    email: string;
  };
}
