-- ExpansiÃ³n del esquema de proyectos (campos financieros + documentos)

ALTER TABLE proyectos
  ADD COLUMN IF NOT EXISTS precio_unitario NUMERIC,
  ADD COLUMN IF NOT EXISTS precio_venta_total NUMERIC,
  ADD COLUMN IF NOT EXISTS costo_indirectos NUMERIC,
  ADD COLUMN IF NOT EXISTS costo_marketing NUMERIC,
  ADD COLUMN IF NOT EXISTS costo_permisos NUMERIC,
  ADD COLUMN IF NOT EXISTS costo_financiero NUMERIC,
  ADD COLUMN IF NOT EXISTS contingencia NUMERIC,
  ADD COLUMN IF NOT EXISTS area_construccion_m2 NUMERIC,
  ADD COLUMN IF NOT EXISTS tasa_descuento NUMERIC,
  ADD COLUMN IF NOT EXISTS flujo_caja JSONB;

CREATE TABLE IF NOT EXISTS proyecto_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  tipo VARCHAR(80) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  estado VARCHAR(30) DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proyecto_documentos_proyecto_id ON proyecto_documentos(proyecto_id);

