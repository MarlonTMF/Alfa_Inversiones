const { Client } = require('pg');

async function setup() {
  const client = new Client({
    connectionString: 'postgresql://Grupo5:Dracmil2001@181.188.156.195:18063/inmobiliaria',
  });
  
  try {
    await client.connect();
    
    console.log("Creando extensiones...");
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await client.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);

    console.log("Creando tabla terrenos...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS terrenos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(50) UNIQUE,
        ubicacion VARCHAR(255) NOT NULL,
        ciudad VARCHAR(100) DEFAULT 'Cochabamba',
        departamento VARCHAR,
        precio NUMERIC(15,2) NOT NULL,
        superficie NUMERIC(10,2) NOT NULL,
        poligono GEOMETRY(Polygon, 4326),
        estado VARCHAR(20) DEFAULT 'disponible',
        id_creador UUID,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creando tabla amenidades...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS amenidades (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nombre VARCHAR(150) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        coordenadas GEOMETRY(Point, 4326),
        ciudad VARCHAR(100) DEFAULT 'Cochabamba',
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("¡Tablas creadas exitosamente!");
  } catch (error) {
    console.error('Error durante la creación:', error);
  } finally {
    await client.end();
  }
}

setup();
