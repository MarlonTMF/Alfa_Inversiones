const { Client } = require('pg');
const client = new Client({
    user: 'postgres', host: 'localhost', database: 'db_inmobiliaria', password: 'Marlon22', port: 5432,
});

async function run() {
    try {
        await client.connect();

        // Check IDs and titles from properties
        const props = await client.query("SELECT id, title FROM properties LIMIT 3");
        console.log('--- PROPERTIES ---');
        console.log(JSON.stringify(props.rows, null, 2));

        // Check Users with roles
        const users = await client.query("SELECT id, email, role FROM usuarios LIMIT 10");
        console.log('--- USERS ---');
        console.log(JSON.stringify(users.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();
