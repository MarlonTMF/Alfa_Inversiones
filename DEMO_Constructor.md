# 📋 GUÍA DE DEMOSTRACIÓN — ROL: CONSTRUCTOR / DESARROLLADOR
## Plataforma Orquestadora 365 Desarrollo Inmobiliario

**Credenciales de acceso:** const@empresa.com / 123

---

## CASO DE USO 1: INGRESO AL SISTEMA

### Flujo paso a paso:
1. El representante de la constructora abre la plataforma y ve la **Página de Inicio** pública.
2. En la barra de navegación superior, hace clic en el botón **[ Iniciar Sesión ]**.
3. Se despliega un **modal flotante translúcido** para inicio de sesión:
   - Campo **Email** → Escribir: `const@empresa.com`
   - Campo **Contraseña** → Escribir: `123`
4. Presionar el botón azul **[ INGRESAR ]**.
5. El sistema valida las credenciales y redirige al **Dashboard de Constructor** (Constructor Portal).

---

## CASO DE USO 2: PORTAL CONSTRUCTOR (DASHBOARD)

### Lo que el constructor ve al ingresar:

**Menú lateral izquierdo (Sidebar) con:**
- Título del portal: **APEX Institutional**.
- Enlaces principales: **Home Dashboard** | **Gestionar Proyectos** | **Explorar Mapa** | **Métricas de Tierra** | **Bóveda Legal**.
- Card de perfil de usuario en la parte inferior que muestra el nombre de la constructora (ej: *Constructora Delta*), rol *Gestor de Activos* y el botón **[ Cerrar Sesión ]** al hacer clic en él.
- Botón de **Soporte Técnico**: *Contactar Analista*.

**Barra superior fija con:**
- Título de la pantalla activa: **Constructor Portal**.
- Estado de sincronización: *"🟢 Conectado • Latencia: 24ms"*.
- Nombre del profesional a cargo de la obra: *"Marcus Thorne — Lead Architect"*.
- Foto de perfil del profesional.

**Banner de Bienvenida (Hero Section):**
- Imagen de fondo de obra y maquinaria a gran escala.
- Badge: *"Portal Status: Operational"*.
- Mensaje: *"Bienvenido de nuevo, Marcus. Tus métricas de desarrollo global están sincronizadas."*
- Botones de acción rápida:
  - **[ Enviar Propuesta Técnica ]**
  - **[ Análisis de Pipeline ]**

**Tarjetas de métricas operacionales (3 columnas):**
- **Alianzas Activas**: Número de socios institucionales vigentes (ej: *4*).
- **Propuestas Pendientes**: Trámites o propuestas que requieren acción del constructor (ej: *2*).
- **Terrenos Disponibles**: Número de tierras identificadas aptas para la adquisición (ej: *142*).

**Sección de Acciones Críticas (Panel derecho):**
Accesos rápidos con íconos para navegación directa:
- **Descubrir Tierras** → Navega al Mapa interactivo.
- **Bóveda Legal** → Abre el módulo de licencias y permisos.
- **Archivo de Proyectos** → Historial de obras finalizadas.

**Sección "Oportunidades Premium" (Banco de Terrenos):**
- Grid con tarjetas de terrenos recomendados con la mayor viabilidad constructiva.
- Cada tarjeta muestra una foto real, la ubicación del lote, el rendimiento estimado (Yield), la zonificación permitida (ej: *Zonificación Comercial*) y el área total.
- Enlace superior: **[ Ver Mapa Completo ]**.

**Sección "Pipeline de Construcción" (Proyectos Activos):**
- Lista vertical de proyectos en ejecución asignados a la constructora.
- Cada fila del proyecto muestra:
  - Miniatura de la obra.
  - Nombre del proyecto (ej: *"Lumina Tower"*).
  - Fase de avance (ej: *"Fase: Cimentación"*).
  - Barra de progreso del avance global (ej: *68%*).
  - Ícono de flecha **[ chevron_right ]** para entrar al detalle.

**Sección de Actividad Reciente:**
- Feed de eventos críticos en los frentes de obra (ej: *"Reporte Q3 de Integridad Estructural"*, *"Aprobación de Zonificación Confirmada"*, *"Alerta: Retraso en Cadena de Suministro"*).

**Botón Flotante de Acción Rápida (FAB):**
- Ubicado en la esquina inferior derecha. Al pasar el cursor, muestra el texto *"Enviar Nueva Propuesta"*. Abre el formulario de postulación técnica.

---

## CASO DE USO 3: GESTIÓN DE PIPELINE Y RESUMEN DE PROYECTOS

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Gestionar Proyectos ]**.

### Lo que el constructor ve:
- Un encabezado de pantalla con el título **"Resumen de Proyectos"** y la cantidad de obras vigentes (ej: *14 proyectos*).
- Panel de métricas globales financieras: **Valoración Total de Obras** (ej: *$1.24B USD*).
- Botón: **[ INICIAR NUEVO PROYECTO ]** para agregar una nueva obra de construcción.
- Grid de Proyectos Activos: Tarjetas detalladas de cada proyecto que muestran el personal técnico activo en sitio (ej: *45 Técnicos*), el índice de seguridad laboral (ej: *99.8%*) y accesos rápidos para ver informes o cámaras de seguridad de la obra.

---

## CASO DE USO 4: DETALLE TÉCNICO DE LA OBRA

### Navegación:
Desde el Resumen de Proyectos → Hacer clic sobre la tarjeta de un proyecto (ej: *"Lumina Tower"*).

### Lo que el constructor ve:
- **Barra superior**: Nombre del proyecto activo.
- Botón destacado en azul: **[ PUBLICAR AVANCE ]** para subir reportes diarios.
- **Métricas Técnicas (3 columnas)**:
  - **ROI Esperado** (ej: *18%*).
  - **Progreso Real de Obra** (ej: *68% completado*).
  - **Capital Recaudado** (ej: *$18M*).
- **Última Actualización Publicada**:
  - Imagen en alta definición de la obra real.
  - Descripción del estado de la ruta crítica y hitos de construcción.
  - Métricas de control de calidad: Personal en sitio, estado QC (ej: *Aprobado*) y cronograma (ej: *A Tiempo*).
- **Panel de Gobernanza (Columna derecha)**:
  - Datos de identificación del activo: ID único, entidad legal responsable y arquitecto jefe.
  - Barra de fondeo de capital con el monto recaudado vs el objetivo.

---

## CASO DE USO 5: REGISTRO Y PUBLICACIÓN DE AVANCES DE OBRA

### Navegación:
Desde el Detalle Técnico del Proyecto → Hacer clic en el botón azul **[ PUBLICAR AVANCE ]**.

### Flujo paso a paso:
1. El constructor ve la pantalla **"Protocolo de Reporte de Avance"**.
2. **Interruptor de Notificación**: En la barra superior derecha, puede hacer clic para activar/desactivar el botón deslizante de **"Notificar Inversores"** (cambia de color azul a gris).
3. **Editor de Reportes (Área Central)**:
   - Panel de formato de texto (Negrita, Cursiva, Listas, Enlaces).
   - Área de texto para escribir la minuta técnica: *"Describe el progreso de la ruta crítica, asignación de recursos y cumplimiento de seguridad..."*
4. **Galería Multimedia (Bento Grid)**:
   - Muestra las fotos ya subidas del proyecto en tiempo real.
   - Botón interactivo con ícono de cámara: **[ Añadir Captura ]** → Abre la ventana para seleccionar imágenes de la inspección física en obra.
5. **Panel Lateral "Vinculación de Hitos"**:
   - Muestra un listado de hitos programados en el cronograma original.
   - El constructor selecciona el hito que está reportando (ej: *"Hito 04: Cimentación Principal — Progreso: 95%"*).
6. **Publicación**: Una vez completado el reporte de texto y subidas las fotos, hace clic en el botón azul de confirmación: **[ PUBLICAR ACTUALIZACIÓN ]** en la parte inferior derecha.

---

## CASO DE USO 6: BÓVEDA LEGAL DE LA CONSTRUCTORA

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Bóveda Legal ]**.

### Lo que el constructor ve:
- **Resumen Documental**: Tarjetas KPI que clasifican las licencias por categoría: Permisos Ambientales, Títulos de Propiedad y Licencias de Construcción. Cada tarjeta muestra el porcentaje de cobertura y estado de auditoría.
- **Libro de Documentos Verificados (Tabla)**:
  - Buscador integrado.
  - Listado de licencias ambientales y permisos de suelo otorgados por curadurías o municipios.
  - Cada fila muestra la entidad emisora, fecha de vigencia, la firma digital del auditor y el botón **[ Descargar PDF ⬇ ]** para auditorías locales de obra.
- Botón en el encabezado de página: **[ NUEVA PUBLICACIÓN LEGAL ]** para registrar y anexar una nueva licencia oficial de construcción.

---

## CASO DE USO 7: SUBIR NUEVA LICENCIA O DOCUMENTO LEGAL

### Navegación:
Desde la Bóveda Legal de la Constructora → Hacer clic en **[ NUEVA PUBLICACIÓN LEGAL ]**.

### Flujo paso a paso:
1. El constructor ve la pantalla **"Nueva Actualización Documental"**.
2. Completa los campos solicitados en el formulario:
   - **Categoría Documental** (Dropdown) → Seleccionar el tipo de documento (ej: *Licencia de Construcción, Permiso Ambiental*).
   - **Estado Inicial** → Botones de selección rápida: **[ Verificado ]** | **[ En Proceso ]** | **[ Pendiente ]**.
   - **Referencia Oficial** → Escribir el código oficial (ej: *REF-2024-001*).
   - **Fecha de Emisión** → Seleccionar en el calendario la fecha de expedición.
   - **Ente Emisor** → Nombre de la oficina de gobierno o notaría.
3. **Zona de Carga (Dragzone)**: Caja discontinua para arrastrar el expediente técnico en PDF o imagen de la licencia oficial (Máx. 25MB).
4. El constructor finaliza la carga presionando el botón: **[ Publicar Actualización ]** o puede elegir **[ Guardar como Borrador ]** para completarlo posteriormente.
