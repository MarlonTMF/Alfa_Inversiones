-- Script para crear la tabla de proyectos
-- Ejecutar en PostgreSQL

-- Tabla principal de proyectos
CREATE TABLE IF NOT EXISTS proyectos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    descripcion TEXT,
    
    -- Relación con property (terreno)
    property_id UUID REFERENCES properties(id),
    
    -- Relación con constructor (socio)
    constructor_id UUID REFERENCES socios(id),
    
    -- Fechas del proyecto
    fecha_inicio DATE,
    fecha_fin_estimado DATE,
    fecha_fin_real DATE,
    
    -- Estado del proyecto
    estado VARCHAR(50) DEFAULT 'planificacion',
    
    -- Costos del proyecto
    costo_terreno NUMERIC,
    costo_construccion NUMERIC,
    presupuesto_total NUMERIC,
    precio_venta_estimado NUMERIC,
    
    -- Métricas del proyecto
    roi NUMERIC,
    margen_utilidad NUMERIC,
    velocidad_venta NUMERIC,
    incidencia_terreno NUMERIC,
    
    -- Complexidad
    numero_niveles INTEGER,
    numero_unidades INTEGER,
    tipo_proyecto VARCHAR(50),
    
    -- Metadatos
    creator_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_proyectos_property_id ON proyectos(property_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_constructor_id ON proyectos(constructor_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_fecha_inicio ON proyectos(fecha_inicio);

-- Tabla para seguir el avance de cada proyecto
CREATE TABLE IF NOT EXISTS proyecto_fases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    fecha_inicio_estimada DATE,
    fecha_fin_estimada DATE,
    fecha_inicio_real DATE,
    fecha_fin_real DATE,
    progreso INTEGER DEFAULT 0,  -- 0-100
    estado VARCHAR(50) DEFAULT 'pendiente',  -- pendiente, en_progreso, completada, bloqueada
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proyecto_fases_proyecto_id ON proyecto_fases(proyecto_id);

-- Tabla para métricas históricas del proyecto
CREATE TABLE IF NOT EXISTS proyecto_metricas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    unidades_vendidas INTEGER DEFAULT 0,
    ingreso_acumulado NUMERIC DEFAULT 0,
    costo_acumulado NUMERIC DEFAULT 0,
    roi_actual NUMERIC,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proyecto_metricas_proyecto_id ON proyecto_metricas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_metricas_fecha ON proyecto_metricas(fecha);

-- Comentarios para documentación
COMMENT ON TABLE proyectos IS 'Tabla principal para gestionar proyectos de desarrollo inmobiliario';
COMMENT ON TABLE proyecto_fases IS 'Fases/etapas de cada proyecto (planificación, construcción, venta, etc.)';
COMMENT ON TABLE proyecto_metricas IS 'Métricas históricas del proyecto para análisis y gráficos';