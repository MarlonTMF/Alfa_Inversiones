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

        const props = await client.query("SELECT id, title FROM properties LIMIT 3");
        console.log('--- PROPERTIES ---');
        console.log(JSON.stringify(props.rows, null, 2));

        const admins = await client.query("SELECT id, nombre, rol FROM usuarios WHERE rol IN ('admin', 'superadmin') LIMIT 1");
        console.log('--- ADMINS ---');
        console.log(JSON.stringify(admins.rows, null, 2));

        const users = await client.query("SELECT id, nombre, rol FROM usuarios WHERE rol NOT IN ('admin', 'superadmin') LIMIT 2");
        console.log('--- USERS ---');
        console.log(JSON.stringify(users.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
