const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

async function sync() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '5432'),
    });

    try {
        await client.connect();
        console.log('--- Conectado a Postgres para sincronización ---');

        const passHash = await bcrypt.hash('password123', 10);
        
        const usuarios = [
            {
                email: 'superadmin@365soft.com',
                nombre: 'Super Orquestador',
                rol: 'super-admin',
                password: passHash
            },
            {
                email: 'admin@365soft.com',
                nombre: 'Administrador Operativo',
                rol: 'admin',
                password: passHash
            }
        ];

        for (const u of usuarios) {
            // Verificar si existe (por email)
            const check = await client.query('SELECT id FROM usuarios WHERE email = $1', [u.email]);
            
            if (check.rows.length > 0) {
                // Actualizar
                await client.query(
                    'UPDATE usuarios SET password = $1, rol = $2, nombre = $3 WHERE email = $4',
                    [u.password, u.rol, u.nombre, u.email]
                );
                console.log(`[OK] Usuario actualizado: ${u.email}`);
            } else {
                // Insertar
                const id = crypto.randomUUID();
                await client.query(
                    'INSERT INTO usuarios (id, nombre, email, password, rol) VALUES ($1, $2, $3, $4, $5)',
                    [id, u.nombre, u.email, u.password, u.rol]
                );
                console.log(`[OK] Usuario creado: ${u.email}`);
            }
        }

        // Opcional: Limpiar usuarios con dominios antiguos para evitar confusiones
        await client.query("DELETE FROM usuarios WHERE email = 'admin@365desarrollo.com'");
        console.log('[INFO] Limpieza de correos antiguos completada.');

        console.log('--- Sincronización finalizada con éxito ---');
    } catch (err) {
        console.error('[ERROR] Fallo en la sincronización:', err);
    } finally {
        await client.end();
    }
}

sync();
