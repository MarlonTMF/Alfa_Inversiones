const { Client } = require('pg');

async function test() {
  const client = new Client({
    connectionString: 'postgresql://Grupo5:Dracmil2001@181.188.156.195:18063/inmobiliaria',
  });

  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await client.end();
  }
}

test();
