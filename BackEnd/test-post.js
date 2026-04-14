const http = require('http');

const data = JSON.stringify({
    categoria: "Residencial",
    ciudad: "Test City",
    zona: "Test Zone",
    direccion: "Test Address",
    coordenadas: JSON.stringify({
        type: "Polygon",
        coordinates: [[[ -66.1568, -17.3895 ], [ -66.1550, -17.3895 ], [ -66.1550, -17.3880 ], [ -66.1568, -17.3895 ]]]
    }),
    superficie: 100,
    frente: 10,
    fondo: 10,
    precioBase: 100000,
    rol: "propietario-terreno",
    nombrePropietario: "Carlos Mendes",
    emailPropietario: "carlos.mendes2@test.com",
    telefonoPropietario: "70012345",
    passwordGenerado: "fXEEcO0r"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/properties/register-full',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log(`BODY: ${body}`); });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
