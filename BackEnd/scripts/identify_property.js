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
        const res = await client.query("SELECT * FROM properties WHERE id = 'e47e11e8-3a5f-4d5c-9c9a-7a8b9c0d1e2f'");
        console.log('--- PROPERTY INFO ---');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
