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

const sqlFile = process.argv[2] || 'expand_socios_table.sql';

async function run() {
  try {
    await client.connect();
    const sqlPath = path.join(__dirname, sqlFile);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    console.log(`Successfully executed ${sqlFile}`);
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

run();
