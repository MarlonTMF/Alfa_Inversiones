const { Client } = require('pg');

async function checkColumns() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/alfa_invest'
    });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'properties'
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkColumns();
