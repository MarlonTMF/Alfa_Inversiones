const { Client } = require('pg');

async function seed() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'db_inmobiliaria',
        password: 'Marlon22',
        port: 5432,
    });

    try {
        await client.connect();
        console.log('Conectado a la base de datos.');

        // 1. Añadir columna si no existe
        await client.query('ALTER TABLE terrenos ADD COLUMN IF NOT EXISTS departamento VARCHAR');
        console.log('Columna departamento asegurada.');

        // 2. Datos de ejemplo
        const ejemplos = [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                ubicacion: 'Cabañas del Piraí',
                precio: 450000,
                superficie: 800,
                departamento: 'Santa Cruz',
                poligono: [[-17.785, -63.220], [-17.785, -63.222], [-17.787, -63.222], [-17.787, -63.220], [-17.785, -63.220]]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                ubicacion: 'Calacoto Calle 15',
                precio: 620000,
                superficie: 500,
                departamento: 'La Paz',
                poligono: [[-16.540, -68.085], [-16.540, -68.087], [-16.542, -68.087], [-16.542, -68.085], [-16.540, -68.085]]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                ubicacion: 'Av. Banzer 4to Anillo',
                precio: 350000,
                superficie: 600,
                departamento: 'Santa Cruz',
                poligono: [[-17.745, -63.170], [-17.745, -63.172], [-17.747, -63.172], [-17.747, -63.170], [-17.745, -63.170]]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440004',
                ubicacion: 'Sopocachi Plaza España',
                precio: 280000,
                superficie: 400,
                departamento: 'La Paz',
                poligono: [[-16.510, -68.125], [-16.510, -68.127], [-16.512, -68.127], [-16.512, -68.125], [-16.510, -68.125]]
            }
        ];

        for (const t of ejemplos) {
            const puntosWKT = t.poligono.map(p => `${p[1]} ${p[0]}`).join(', ');
            const wkt = `POLYGON((${puntosWKT}))`;

            await client.query(
                `INSERT INTO terrenos (id, ubicacion, precio, superficie, poligono, departamento) 
                 VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6)
                 ON CONFLICT (id) DO UPDATE SET departamento = $6, ubicacion = $2`,
                [t.id, t.ubicacion, t.precio, t.superficie, wkt, t.departamento]
            );
            console.log(`Terreno listo: ${t.ubicacion}`);
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

seed();
