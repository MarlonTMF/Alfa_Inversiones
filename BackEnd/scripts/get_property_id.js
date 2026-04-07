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
        
        // 1. Get columns of properties to avoid errors
        const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'properties'");
        console.log('Columns in properties:', cols.rows.map(r => r.column_name).join(', '));

        // 2. Get some property IDs
        const props = await client.query("SELECT id FROM properties LIMIT 1");
        if (props.rows.length > 0) {
            console.log('PROPERTY_ID:', props.rows[0].id);
        } else {
            console.log('No properties found. Creating one...');
            const newProp = await client.query("INSERT INTO properties (id) VALUES (gen_random_uuid()) RETURNING id");
            console.log('NEW_PROPERTY_ID:', newProp.rows[0].id);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
