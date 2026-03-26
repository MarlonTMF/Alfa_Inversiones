const { Client } = require('pg');

async function test() {
  const client = new Client({
    connectionString: 'postgresql://Grupo5:Dracmil2001@181.188.156.195:18063/db_inmobiliaria',
  });
  
  try {
    await client.connect();
    const res = await client.query(`
      SELECT id, nombre, tipo, ST_X(coordenadas) as lng, ST_Y(coordenadas) as lat
      FROM amenidades LIMIT 5;
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await client.end();
  }
}

test();
