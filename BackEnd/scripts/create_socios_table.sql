-- Tabla para Constructoras / Socios
CREATE TABLE IF NOT EXISTS socios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_empresa CHARACTER VARYING(255) NOT NULL,
    nit CHARACTER VARYING(50) UNIQUE NOT NULL,
    representante_legal CHARACTER VARYING(150),
    telefono CHARACTER VARYING(20),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indice para búsquedas rápidas por NIT
CREATE INDEX IF NOT EXISTS idx_socios_nit ON socios(nit);
CREATE INDEX IF NOT EXISTS idx_socios_usuario_id ON socios(usuario_id);
