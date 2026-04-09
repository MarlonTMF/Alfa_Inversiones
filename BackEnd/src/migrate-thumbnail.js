/**
 * Migración: agrega la columna thumbnail_url a property_multimedia si no existe.
 * Ejecutar con: node src/migrate-thumbnail.js
 */
const { Client } = require('pg');

async function migrate() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'db_inmobiliaria',
        password: 'Marlon22',
        port: 5432,
    });

    try {
        await client.connect();
        console.log('Conectado a la base de datos.');
        await client.query(
            'ALTER TABLE property_multimedia ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;'
        );
        console.log('✅  Columna thumbnail_url agregada (o ya existía).');
    } catch (err) {
        console.error('Error en migración:', err.message);
    } finally {
        await client.end();
    }
}

migrate();
