const { Client } = require('pg');
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
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'properties'");
    console.log('COLUMNS_LIST: ' + res.rows.map(r => r.column_name).join(', '));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
