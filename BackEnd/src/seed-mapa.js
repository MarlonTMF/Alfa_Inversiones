const { Client } = require('pg');
const crypto = require('crypto');

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
        console.log('Conectado para siembra definitiva.');

        // Limpieza total de tablas relacionadas para evitar IDs fantasma
        await client.query('TRUNCATE TABLE property_multimedia, legal_docs, legal_tracking_steps, projected_growth, favoritos, properties CASCADE');

        const ejemplos = [
            {
                id: crypto.randomUUID(),
                name: 'Residencias Calacoto',
                city: 'La Paz',
                department: 'La Paz',
                district: 'Sur',
                lat: -16.5100,
                lng: -68.1400,
                price_per_m2: 1100,
                total_area: 400,
                base_price_negotiation: 440000,
                projected_roi: 11.8,
                land_incidence: 19.2,
                status: 'disponible',
                poligono: [[-68.140, -16.510], [-68.142, -16.510], [-68.142, -16.512], [-68.140, -16.512], [-68.140, -16.510]]
            },
            {
                id: crypto.randomUUID(),
                name: 'Distrito Equipetrol',
                city: 'Santa Cruz',
                department: 'Santa Cruz',
                district: 'Equipetrol',
                lat: -17.7612,
                lng: -63.1921,
                price_per_m2: 1200,
                total_area: 850,
                base_price_negotiation: 1020000,
                projected_roi: 22.4,
                land_incidence: 18.5,
                status: 'disponible',
                poligono: [[-63.192, -17.761], [-63.193, -17.761], [-63.193, -17.762], [-63.192, -17.762], [-63.192, -17.761]]
            },
            {
                id: crypto.randomUUID(),
                name: 'Torre Norte - Av. Busch',
                city: 'Santa Cruz',
                department: 'Santa Cruz',
                district: 'D10',
                lat: -17.7500,
                lng: -63.1850,
                price_per_m2: 950,
                total_area: 1200,
                base_price_negotiation: 1140000,
                projected_roi: 15.5,
                land_incidence: 21.0,
                status: 'disponible',
                poligono: [[-63.185, -17.750], [-63.186, -17.750], [-63.186, -17.751], [-63.185, -17.751], [-63.185, -17.750]]
            }
        ];

        for (const t of ejemplos) {
            const puntosWKT = t.poligono.map(p => `${p[0]} ${p[1]}`).join(', ');
            const wkt = `POLYGON((${puntosWKT}))`;

            await client.query(
                `INSERT INTO properties (id, name, city, department, district, lat, lng, price_per_m2, total_area, base_price_negotiation, projected_roi, land_incidence, status, polygon) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, ST_GeomFromText($14, 4326))`,
                [t.id, t.name, t.city, t.department, t.district, t.lat, t.lng, t.price_per_m2, t.total_area, t.base_price_negotiation, t.projected_roi, t.land_incidence, t.status, wkt]
            );
            console.log(`Poblado: ${t.name} (${t.department}) - ID: ${t.id}`);
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

seed();
