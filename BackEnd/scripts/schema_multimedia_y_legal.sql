-- 1. Tabla para Fotos y Videos (Estrategia Híbrida ImageKit/Cloudinary)
CREATE TABLE IF NOT EXISTS property_multimedia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'photo' o 'video'
    provider VARCHAR(50) NOT NULL, -- 'imagekit' o 'cloudinary'
    url TEXT NOT NULL,
    public_id TEXT, -- Para borrar el archivo real en la nube después
    is_main BOOLEAN DEFAULT false,
    label VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Refuerzo de Índices (Para que el mapa y las listas carguen rápido)
CREATE INDEX IF NOT EXISTS idx_property_multimedia_property_id ON property_multimedia(property_id);
CREATE INDEX IF NOT EXISTS idx_legal_docs_property_id ON legal_docs(property_id);
CREATE INDEX IF NOT EXISTS idx_legal_tracking_steps_property_id ON legal_tracking_steps(property_id);

-- 3. Opcional: Añadir columna de proveedor a legal_docs para consistencia
ALTER TABLE legal_docs ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'imagekit';
