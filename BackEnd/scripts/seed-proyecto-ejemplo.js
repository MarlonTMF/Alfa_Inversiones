const { Client } = require('pg');
require('dotenv').config();

async function seedProyecto() {
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

    const usuarioRes = await client.query(
      "SELECT id, rol, email FROM usuarios WHERE rol IN ('admin','superadmin','super-admin') ORDER BY fecha_creacion ASC LIMIT 1",
    );
    if (usuarioRes.rows.length === 0) {
      throw new Error(
        "No hay usuarios admin/super-admin. Ejecuta primero: node scripts/seed-super-admin.js",
      );
    }

    const creatorId = usuarioRes.rows[0].id;

    const codigo = `PROY-${new Date().getFullYear()}-001`;
    const existente = await client.query('SELECT id FROM proyectos WHERE codigo = $1', [codigo]);
    if (existente.rows.length > 0) {
      console.log(`Ya existe un proyecto con codigo ${codigo}. No se inserta duplicado.`);
      return;
    }

    await client.query(
      `
      INSERT INTO proyectos (
        nombre,
        codigo,
        descripcion,
        estado,
        tipo_proyecto,
        creator_id,
        created_at,
        updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      `,
      [
        'Proyecto Demo (Torre Central)',
        codigo,
        'Proyecto de ejemplo para validar el ciclo completo (UI -> API -> DB -> UI).',
        'planificacion',
        'residencial',
        creatorId,
      ],
    );

    console.log('Proyecto ejemplo insertado con éxito.');
  } catch (err) {
    console.error('Error seed proyecto:', err.message || err);
  } finally {
    await client.end();
  }
}

seedProyecto();

