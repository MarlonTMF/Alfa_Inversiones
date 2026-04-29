const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'db_inmobiliaria',
  password: 'Marlon22',
  port: 5432,
});

async function run() {
  try {
    await client.connect();
    const sqlPath = path.join(__dirname, 'expand_proyectos_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    console.log('Successfully executed expand_proyectos_table.sql');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

run();

