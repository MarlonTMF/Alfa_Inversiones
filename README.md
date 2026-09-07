# 🏢 LINK — Plataforma de Inteligencia Inmobiliaria

Plataforma que conecta a **constructoras**, **inversionistas** y **propietarios de terreno** alrededor del ciclo de vida completo de un proyecto inmobiliario en Bolivia: desde el registro de un terreno hasta el seguimiento de obra y el retorno de la inversión, sobre un mapa geoespacial interactivo.

Proyecto desarrollado en equipo (365SOFT — Grupo 5) como monorepo full-stack.

- 🌐 **Demo en vivo:** https://inversiones-bo-inmobiliaria.netlify.app/
- 🔌 **API en producción:** https://alfa-inversiones.onrender.com *(backend en Render free tier: la primera petición puede tardar ~30s en "despertar")*

## Demo rápida

La landing permite entrar directo a cada panel sin registrarse (botones de demo por rol) o con estas credenciales:

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@365soft.com` | `123` |
| Inversionista | `alex@architect.com` | `alex123` |
| Constructora | `const@empresa.com` | `123` |

Guías paso a paso de cada flujo: [`DEMO_Administrador.md`](DEMO_Administrador.md) · [`DEMO_Inversionista.md`](DEMO_Inversionista.md) · [`DEMO_Constructor.md`](DEMO_Constructor.md) · [`DEMO_Propietario.md`](DEMO_Propietario.md)

## Qué hace

- **Mapa geoespacial interactivo** (Leaflet) con terrenos y proyectos georreferenciados sobre Bolivia, cálculo de precio por m² y polígonos reales de lote.
- **Panel Administrador**: registro de terrenos, constructoras e inversiones, control de proyectos por fases (planificación → recaudación → construcción → venta), auditoría y verificación legal de documentos.
- **Panel Constructor**: publicación de avances de obra con bitácora fotográfica, gestión de la bóveda legal del proyecto, análisis de pipeline.
- **Panel Inversionista**: portafolio de inversiones, seguimiento de avance de obra en tiempo real, terminal de inversión, análisis financiero por proyecto.
- **Autenticación multirol** con guards de ruta por rol y sesión persistente.

## Stack técnico

**Frontend** — `/FrontEnd`
- Angular 21 (standalone components, sin NgModules)
- TypeScript, Tailwind CSS 3
- Leaflet para el mapa geoespacial

**Backend** — `/BackEnd`
- NestJS 11 + TypeScript
- TypeORM sobre PostgreSQL
- Autenticación JWT, WebSockets para actualizaciones en tiempo real
- DTOs validados con `class-validator` en cada endpoint

**Infraestructura**
- Frontend: Netlify
- Backend + PostgreSQL: Render

## Estructura del repositorio (monorepo)

```
/FrontEnd   Aplicación Angular (SPA)
/BackEnd    API NestJS + PostgreSQL
```

## Correr el proyecto en local

### Backend
```bash
cd BackEnd
npm install
cp .env.template .env   # completar con credenciales propias de Postgres
npm run start:dev
```

### Frontend
```bash
cd FrontEnd
npm install
npm start
```
La app queda disponible en `http://localhost:4200`.

## Equipo

Diego García · Marlon T. · Walter Rocha
