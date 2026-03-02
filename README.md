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