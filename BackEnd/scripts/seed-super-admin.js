const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

async function seed() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'Marlon22',
        database: process.env.DB_NAME || 'db_inmobiliaria',
    });

    try {
        await client.connect();
        console.log('Conectado a PostgreSQL...');

        const email = 'superadmin@365soft.com';
        const password = 'superadmin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const nombre = 'Súper Orquestador';
        const rol = 'super-admin';
        const id = crypto.randomUUID();

        // Verificar si existe
        const res = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (res.rows.length > 0) {
            console.log(`El usuario ${email} ya existe. Actualizando rol a super-admin...`);
            await client.query('UPDATE usuarios SET rol = $1 WHERE email = $2', [rol, email]);
        } else {
            console.log(`Creando nuevo super-admin: ${email}`);
            await client.query(
                'INSERT INTO usuarios (id, nombre, rol, email, password, fecha_creacion) VALUES ($1, $2, $3, $4, $5, NOW())',
                [id, nombre, rol, email, hash]
            );
        }

        console.log('Seed finalizado con éxito.');
    } catch (err) {
        console.error('Error durante el seed:', err.stack);
    } finally {
        await client.end();
    }
}

seed();
