# 📋 GUÍA DE DEMOSTRACIÓN — ROL: INVERSIONISTA
## Plataforma Orquestadora 365 Desarrollo Inmobiliario

**Credenciales de acceso:** alex@architect.com / alex123

---

## CASO DE USO 1: INGRESO AL SISTEMA

### Flujo paso a paso:

1. El usuario abre la plataforma y ve la **Página de Inicio** pública.
2. En la barra de navegación superior, hace clic en el botón **[ Iniciar Sesión ]**.
3. Se abre un **modal flotante translúcido** con dos campos:
   - Campo **Email** → Escribir: `alex@architect.com`
   - Campo **Contraseña** → Escribir: `alex123`
4. Presionar el botón azul **[ INGRESAR ]**.
5. El sistema valida las credenciales y redirige al **Dashboard del Inversionista**.

---

## CASO DE USO 2: DASHBOARD PRINCIPAL DEL INVERSIONISTA

### Lo que el usuario ve al ingresar:

**Barra superior fija** con:
- Foto de perfil circular del usuario (izquierda).
- Nombre de la marca: **Architect** (en azul).
- Menú de navegación horizontal con los enlaces: **Portafolio** | **Mercado** | **Avances de Obra** | **Bóveda Legal** | **Análisis**.
- Botón de **Notificaciones** (campana) y botón de **Cerrar Sesión** (rojo).

**Sección de bienvenida:**
- Título: *"Bienvenido, Alex"* (nombre dinámico del usuario logueado).
- Subtítulo: *"Tu centro de operaciones está actualizado. Revisa el rendimiento de tu portafolio."*

**Tarjetas de métricas rápidas (3 columnas):**

| Tarjeta | Contenido |
|---|---|
| **Valor Total Neto** | Muestra el monto acumulado (ej: $1,245,000) con indicador de crecimiento (+8.3%) y texto *"Actualizado hace 5 minutos"*. |
| **Próximo Dividendo** | Muestra el nombre de la propiedad que generará el próximo pago, la fecha estimada y el monto (ej: $12,400). Al hacer clic navega al Mapa de Mercado. |

**Grid de navegación principal (Bento Grid):**

| Tarjeta | Qué muestra | Acción al hacer clic |
|---|---|---|
| **Mi Portafolio** (tarjeta grande, 2/3 del ancho) | Imagen de fondo de un edificio. Indica *"14 Propiedades"* como activos totales. Gráfico de barras miniatura. | Navega a la pantalla de **Portafolio de Inversiones**. |
| **Marketplace** (tarjeta lateral, 1/3 del ancho) | Badge azul que dice **"Nuevo"**. Texto: *"Explora 3 nuevas oportunidades disponibles hoy"*. Enlace: *"Ver Oportunidades →"*. | Navega al **Mapa Interactivo** para explorar terrenos. |

**Sección de Actividad Reciente:**
- Título: *"Actividad Reciente"* con enlace **[ Ver Todo ]**.
- Lista vertical de eventos con ícono, título, descripción, monto y fecha:
  - Ejemplo: *"Distribución Trimestral Recibida"* — *Lumina Tower* — **+$12,400** — *Hace 2 días*.
  - Ejemplo: *"Documento Legal Actualizado"* — *Contrato de Participación* — *Hace 1 semana*.

---

## CASO DE USO 3: MI PORTAFOLIO DE INVERSIONES

### Navegación:
Desde el Dashboard → Hacer clic en la tarjeta grande **"Mi Portafolio"** o en el enlace **Portafolio** de la barra superior.

### Lo que el usuario ve:

**Botón de regreso:** `[ ← Volver al Inicio ]`

**Encabezado:**
- Título: **"Mi Portafolio de Inversiones"**
- Subtítulo: *"Seguimiento en tiempo real de tus proyectos inmobiliarios activos en Bolivia."*
- Botón azul: **[ + Nueva Inversión ]** (esquina superior derecha).

**Tarjetas KPI (3 columnas):**

| KPI | Valor | Indicador |
|---|---|---|
| **Total Invertido** | $150,000 | +5.2% (verde) |
| **Rendimiento Promedio** | 12.5% | +1.2% (verde) |
| **Proyectos Activos** | 4 | "en curso" |

**Pestañas de filtro:**
- **En Construcción (3)** (pestaña activa, subrayada en azul)
- **Finalizados (1)**
- **Preventa (2)**

**Tarjetas de Proyectos (Grid de 2 columnas):**
Cada tarjeta de proyecto tiene:
- **Imagen** del proyecto (lado izquierdo).
- **Badge de ubicación** con ícono de pin y nombre de la ciudad.
- **Nombre del proyecto** (ej: *"Lumina Tower"*).
- **Badge** verde que dice **"Legal ✔"** (verificado legalmente).
- **Barra de avance de obra** con porcentaje (ej: 68%) y fase actual (ej: *"Fase actual: Estructural"*).
- **Rendimiento Acumulado** en verde (ej: +12.8%).
- Botón: **[ Ver Detalles → ]** → Navega a la pantalla de **Detalle de Inversión**.

---

## CASO DE USO 4: DETALLE DE UNA INVERSIÓN ESPECÍFICA

### Navegación:
Desde el Portafolio → Hacer clic en **[ Ver Detalles → ]** en cualquier tarjeta de proyecto.

### Lo que el usuario ve:

**Barra lateral izquierda (Sidebar)** con:
- Foto y nombre del usuario: *"Alex Vance — Inversor Institucional"*.
- Menú: **Dashboard** | **Portafolio** (activo) | **Avances de Obra** | **Bóveda Legal**.
- Botón inferior: **[ Descargar Reporte PDF ]**.

**Encabezado del proyecto:**
- Badge: *"Construcción Activa"* + ID del proyecto.
- Título enorme del proyecto (ej: **"Lumina Tower"**).
- Descripción del desarrollo.
- Dos botones de acción:
  - **[ 🔒 Bóveda Legal ]** → Navega a los documentos legales.
  - **[ ⬇ Reporte Mensual ]** → Descarga un PDF.

**Tarjetas de métricas (3 columnas):**

| Métrica | Valor |
|---|---|
| **Total Invertido** | $75,000 con texto *"Capital Comprometido"* |
| **Rendimiento Actual** | +18.4% con texto *"Sobre lo proyectado"* |
| **Participación Equity** | 4.2% con texto *"Nivel Institucional B"* |

**Gráfico de Crecimiento de Valoración:**
- Panel grande con imagen de gráfico de rendimiento histórico.
- Botones de período: **[ 1A ]** | **[ TODO ]** (activo).

**Panel lateral derecho:**
- **Progreso del Proyecto**: Barra al 68% con información de la última actualización y próximo hito (*"Instalación de Sistemas HVAC — Vence Nov 12"*).
- **Tarjeta de Distribución** (gradiente azul): Muestra la próxima fecha de pago y el monto estimado (ej: *"$8,200"*).

**Tarjetas de cumplimiento (3 columnas al fondo):**
- **Contexto de Mercado**: *"Crecimiento Metropolitano — Índice de demanda 8.4/10"*.
- **Estado de Cumplimiento**: *"Totalmente Conforme — Documentos K-1 disponibles"*.
- **Calificación ESG**: *"Grado Platino — Huella de carbono 18% inferior"*.

**Botón flotante** (esquina inferior derecha): **[ 💬 Contactar Asesor ]**.

---

## CASO DE USO 5: ANÁLISIS DE PROYECTO

### Navegación:
Desde el Dashboard → Hacer clic en **Análisis** en la barra superior.

### Lo que el usuario ve:

**Hero visual a pantalla completa:**
- Imagen panorámica del proyecto con efecto parallax.
- Badge: *"Activo Institucional"* + ubicación con ícono de pin.
- Título del proyecto (ej: **"Lumina Tower"**).
- Panel con barra de fondeo: *"$18.2M / $24M"* = **76% Fondeado**.
- Botón: **[ Participar Ahora ]** → Navega a la **Terminal de Inversión**.

**Tarjetas KPI (4 columnas):**

| KPI | Valor | Subtexto |
|---|---|---|
| **ROI Objetivo** | 18.4% | *Tasa Interna de Retorno Anualizada* |
| **Rendimiento Proyectado** | 7.2% | *Distribución Trimestral Estimada* |
| **Periodo de Retención** | 36M | *Liquidación de Activos Programada* |
| **Ratio LTV** | 62% | *Estructura de Apalancamiento* |

**Sección "Pulso del Proyecto":**
- Lista vertical de eventos recientes del proyecto con íconos, títulos y tiempos:
  - *"Aprobación de Zonificación"* — Hace 2 días.
  - *"Nuevo Inquilino Ancla Confirmado"* — Hace 1 semana.

**Panel lateral "Mercado Regional":**
- **Vacancia Media**: 4.2% (Bajo Institucional).
- **Crecimiento Alquiler**: +12.8% (Top Tier Market).
- Mini-mapa de ubicación del proyecto.

---

## CASO DE USO 6: TERMINAL DE INVERSIÓN (SIMULADOR)

### Navegación:
Desde el Análisis de Proyecto → Hacer clic en **[ Participar Ahora ]**.

### Lo que el usuario ve:

**Barra lateral izquierda** con navegación: **Dashboard** | **Portafolio** | **Terminal de Inversión** (activo).

**Encabezado**: *"Estrategia de Inversión: Alpha Plus"* — *"Maximiza tu rendimiento patrimonial"*.

**Panel del Simulador (columna izquierda):**
- Etiqueta: *"Monto de Inversión"* con el valor formateado en grande (ej: **$250,000**).
- **Slider deslizable** (rango de $10,000 a $1,000,000) → Al mover el slider:
  - Se actualiza en tiempo real el **ROI Mensual Proyectado** (ej: $3,000 USD).
  - Se actualiza el **Rendimiento Anual (14.4% APY)** (ej: $36,000 USD).
- Imagen de pronóstico de rendimiento.

**Panel de Desglose de Cartera (columna central):**
- Gráfico circular SVG que muestra la distribución:
  - **Inmobiliario**: 45%
  - **Fondos Comunes**: 30%
  - **Activos Cobertura**: 25%
- **Contexto del Mercado**: Volatilidad Global (12.4) | Apetito al Riesgo (ALTO).

**Panel del Estratega (columna derecha):**
- Foto del estratega: *"Marcus Thorne — Estratega Senior"*.
- Cita textual sobre la estrategia.
- Botón: **[ 📞 Solicitar Llamada Directa ]**.
- Indicador: *"🟢 EN LÍNEA AHORA"*.

**Barra inferior fija de confirmación:**
- Texto: *"Estrategia Seleccionada: Terminal Alpha Plus Premium"*.
- **Botón verde grande de WhatsApp**: **[ ✅ Confirmar Inversión vía WhatsApp ]** → Abre WhatsApp con mensaje prellenado.
- Texto de seguridad: *"🔒 Verificación Criptográfica End-to-End"*.
- Texto: *"Inicio Estimado: T + 24 Horas"*.

---

## CASO DE USO 7: AVANCES DE OBRA (TIMELINE)

### Navegación:
Desde el Dashboard → Hacer clic en **Avances de Obra** en la barra superior.

### Lo que el usuario ve:

**Barra lateral** con navegación: **Inicio** | **Portafolio** | **Avances de Obra** (activo) | **Bóveda Legal** | **Mercado**.

**Barra superior**: Nombre del proyecto (*"Lumina Tower"*) + pestañas **Análisis General** | **Avances de Obra** (activa).

**Panel Hero:**
- Porcentaje de avance global en grande: **68%** con texto *"Completado Global"*.
- Fecha de entrega estimada (ej: *"Q2 2025"*).
- Barra de progreso con gradiente azul luminoso.

**Panel lateral "Nota del Arquitecto":**
- Cita del arquitecto principal: *"La velocidad estructural ha superado nuestras proyecciones base en un 12%"*.
- Foto y nombre: *"Julian Vane — Arquitecto Principal, Apex Studio"*.

**Línea de Tiempo Vertical (Timeline):**
Cada hito de la construcción aparece como una tarjeta con:
- **Punto azul luminoso** en la línea del tiempo.
- **Imagen real** de la obra en esa fase (lado izquierdo).
- **Badge "Verificado"** si el hito fue auditado.
- **Título del hito** (ej: *"Finalización de Cimentación"*).
- **Fecha** del hito.
- **Descripción** del avance.
- **2 métricas** por hito (ej: *"Concreto Vertido: 2,400 m³"* | *"Días en Sitio: 45"*).

**Panel lateral "Documentación de Obra":**
- Lista de PDFs descargables con ícono, nombre, tamaño y botón de descarga.
- Ejemplo: *"Auditoría Octubre — PDF • 4.2 MB"* con botón **[ ⬇ ]**.

**Tarjeta "Visita la Obra"** (gradiente azul):
- Texto: *"Agenda una visita privada guiada por nuestros ingenieros residentes."*
- Botón: **[ 📅 Agendar Visita ]**.

---

## CASO DE USO 8: BÓVEDA LEGAL (DOCUMENTOS VERIFICADOS)

### Navegación:
Desde el Dashboard → Hacer clic en **Bóveda Legal** en la barra superior.

### Lo que el usuario ve:

**Barra lateral** con navegación: **Inicio** | **Portafolio** | **Avances de Obra** | **Bóveda Legal** (activo) | **Mercado**.

**Barra superior**: *"Equities Core Platform"* con información de última auditoría (*"Oct 24, 2023"*) y tipo de encriptación (*"🔒 AES-256 GCM"*).

**Encabezado:**
- Título: **"Bóveda Legal"**
- Subtítulo: *"Repositorio de Activos Digitales Asegurado Criptográficamente"*.
- Indicador: *"🟢 ACTIVA & SINCRONIZADA"*.

**Tarjetas de resumen (3 columnas):**

| Categoría | Cantidad | Cobertura | Estado |
|---|---|---|---|
| **Permisos Ambientales** | 12 Ítems | 85% | Auditado |
| **Títulos de Propiedad** | 8 Ítems | 100% | Auditado |
| **Licencias de Obra** | 24 Ítems | 62% | Auditado |

Cada tarjeta tiene una barra de progreso coloreada y un badge de estado.

**Tabla "Libro de Documentos Verificados":**
- Barra de búsqueda: *"Buscar por hash, nombre..."*
- Columnas: **Nombre del Documento** | **Auditor Verificado** | **Timestamp Hash** | **Blockchain ID** | **Acción**
- Cada fila muestra:
  - Ícono PDF + nombre del documento + categoría.
  - Nombre del auditor.
  - Marca de tiempo.
  - Hash de blockchain en badge azul.
  - Botón: **[ Descargar PDF ⬇ ]**.

**Sección "Marco de Auditoría de Grado Institucional":**
- Dos pilares con íconos:
  - **Almacenamiento Inmutable**: *"Persistencia de datos en nodos seguros con permisos de eliminación cero."*
  - **Transparencia Total**: *"Logs de acceso en tiempo real para cada interacción y descarga."*
- Imagen con ícono de candado pulsante.
