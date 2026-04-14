const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Marlon22',
  database: process.env.DB_NAME || 'db_inmobiliaria',
  port: process.env.DB_PORT || 5432
});

client.connect()
  .then(() => client.query('ALTER TABLE properties ADD COLUMN creator_id uuid;'))
  .then(() => {
    console.log("Columna agregada exitosamente");
    client.end();
  })
  .catch(e => {
    console.error("Columna ya existe o error:", e);
    client.end();
  });
