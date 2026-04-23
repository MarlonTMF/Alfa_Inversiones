-- Agregar columnas para especialidades y documentos a la tabla socios
ALTER TABLE socios 
ADD COLUMN IF NOT EXISTS especialidades TEXT,
ADD COLUMN IF NOT EXISTS maquinaria TEXT,
ADD COLUMN IF NOT EXISTS archivo_testimonio_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS archivo_padron_url VARCHAR(500);

-- Comentario para las nuevas columnas
COMMENT ON COLUMN socios.especialidades IS 'Lista de especializaciones de la constructora';
COMMENT ON COLUMN socios.maquinaria IS 'Lista de maquinaria disponible';
