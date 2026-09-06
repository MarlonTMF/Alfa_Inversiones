/**
 * Utilidades para elegir la imagen de portada de una propiedad o proyecto.
 *
 * El backend guarda en `multimedia` tanto fotos subidas como videos externos
 * (el formulario de registro de proyecto permite adjuntar una URL de YouTube).
 * Tomar `multimedia[0].url` sin mirar el tipo mete la URL del video dentro de
 * un <img> y la miniatura queda rota para siempre, asi que aqui se descartan
 * los medios que no son imagen antes de elegir.
 */

export const IMAGEN_PLACEHOLDER = '/images/placeholder-propiedad.svg';

const HOSTS_DE_VIDEO = ['youtube.com', 'youtu.be', 'vimeo.com'];
const EXT_DE_VIDEO = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];

/** True si la URL apunta a un video y por lo tanto no sirve como <img src>. */
export function esVideo(url: string | null | undefined): boolean {
  if (!url) return true;
  const u = url.toLowerCase();
  return HOSTS_DE_VIDEO.some((h) => u.includes(h)) || EXT_DE_VIDEO.some((e) => u.includes(e));
}

/** Un item de multimedia sirve como portada si es imagen y tiene URL. */
function sirveComoImagen(m: any): boolean {
  if (!m?.url) return false;
  const tipo = (m.type || m.tipo || m.mimeType || '').toLowerCase();
  if (tipo.startsWith('video')) return false;
  if (tipo.startsWith('image')) return true;
  return !esVideo(m.url);
}

/**
 * Devuelve la portada: la marcada como principal, si no la primera imagen
 * utilizable, y si no hay ninguna, el marcador de posicion local.
 */
export function imagenPrincipal(
  multimedia: any[] | null | undefined,
  respaldo: string = IMAGEN_PLACEHOLDER,
): string {
  const imagenes = (multimedia || []).filter(sirveComoImagen);
  const principal = imagenes.find((m) => m.isMain);
  return principal?.url || imagenes[0]?.url || respaldo;
}
