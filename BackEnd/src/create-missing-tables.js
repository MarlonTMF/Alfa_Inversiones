const { Client } = require('pg');

async function createTables() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'db_inmobiliaria',
        password: 'Marlon22',
        port: 5432,
    });

    try {
        await client.connect();
        console.log('Conectado a la base de datos para crear tablas faltantes.');

        // 1. Crear tabla inversionistas
        await client.query(`
            CREATE TABLE IF NOT EXISTS inversionistas (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                usuario_id UUID NOT NULL,
                ci_dni VARCHAR(255) UNIQUE NOT NULL,
                telefono VARCHAR(255),
                direccion VARCHAR(255),
                profesion VARCHAR(255),
                origen_fondos TEXT,
                fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabla "inversionistas" asegurada.');

        // 2. Crear tabla inversiones
        await client.query(`
            CREATE TABLE IF NOT EXISTS inversiones (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                monto DECIMAL(15, 2) NOT NULL,
                fecha TIMESTAMPTZ NOT NULL,
                comprobante_url TEXT,
                status VARCHAR(50) DEFAULT 'pendiente',
                proyecto_id UUID NOT NULL,
                inversor_id UUID NOT NULL,
                fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
                CONSTRAINT fk_inversor FOREIGN KEY (inversor_id) REFERENCES inversionistas(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabla "inversiones" asegurada.');

    } catch (err) {
        console.error('Error creando tablas:', err.message);
    } finally {
        await client.end();
    }
}

createTables();
