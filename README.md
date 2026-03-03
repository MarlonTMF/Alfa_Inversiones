# 🏢 Plataforma de Inteligencia Inmobiliaria - 365SOFT (Grupo 5)

Repositorio central del sistema de soporte para la decisión geoespacial en inversiones inmobiliarias.

## 📂 Estructura del Repositorio (Monorepo)

- `/frontEnd`: Aplicación cliente (Angular 17+, Leaflet, Tailwind/CSS).
- `/backEnd`: API y base de datos (Stack a definir).

---

## 💻 Estado del Frontend (Fase 1 completada)

El Frontend ya cuenta con el núcleo visual geoespacial funcional:
1. Mapa base interactivo centrado en Bolivia.
2. Geolocalización del usuario.
3. Renderizado de polígonos (terrenos) sobre el mapa.
4. Panel lateral interactivo con detalles financieros y cálculo automático de `$/m²`.

### ⚠️ Contrato de Datos (Atención Backend)
Actualmente, el Frontend está consumiendo un Mock Local en formato JSON. Para la integración real (Mes 2/3), el **Backend deberá exponer un endpoint (Ej: `GET /api/v1/terrenos`)** que devuelva una lista de objetos **exactamente con esta estructura**:

\`\`\`json
[
  {
    "id": "TER-001",
    "poligono": [
      [-17.3750, -66.1575],
      [-17.3750, -66.1560],
      [-17.3765, -66.1560],
      [-17.3765, -66.1575]
    ],
    "precio": 1200000,
    "superficie": 1500,
    "ubicacion": "Zona Norte, Av. América"
  }
]
\`\`\`

*Nota para el DB Admin: El área del terreno NO es un punto central (lat/lng), es un arreglo de coordenadas que forman el polígono de la manzana/lote.*



### ⚠️ Contrato de Datos: Capas de Amenidades (Mes 2)

Para la funcionalidad de activación de capas (Hospitales, Colegios, Mercados, Transporte), el **Frontend NO consumirá APIs externas de mapas directamente** por motivos de rendimiento y arquitectura. 

El equipo de **Backend** es responsable de:
1. Extraer los datos geoespaciales de Cochabamba (Se sugiere usar Overpass API / OpenStreetMap).
2. Limpiar y almacenar estos puntos en la base de datos del proyecto.
3. Exponer un endpoint (Ej: `GET /api/v1/amenidades`) que devuelva la data procesada con la siguiente estructura exacta:

\`\`\`json
[
  { 
    "id": "AM-001", 
    "tipo": "hospital", 
    "nombre": "Hospital Viedma", 
    "coordenadas": [-17.385, -66.148] 
  },
  { 
    "id": "AM-002", 
    "tipo": "colegio", 
    "nombre": "Colegio San Agustín", 
    "coordenadas": [-17.380, -66.160] 
  }
]
\`\`\`
*Nota: El campo `tipo` debe ser estrictamente uno de estos valores: `hospital`, `colegio`, `mercado`, `transporte`. El Frontend mapeará automáticamente los íconos visuales basándose en este string.*