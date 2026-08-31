# 📋 GUÍA DE DEMOSTRACIÓN — ROL: ADMINISTRADOR
## Plataforma Orquestadora 365 Desarrollo Inmobiliario

**Credenciales de acceso:** admin@365soft.com / 123

---

## CASO DE USO 1: INGRESO AL SISTEMA

### Flujo paso a paso:
1. El administrador abre la plataforma y ve la **Página de Inicio** pública.
2. En la barra de navegación superior, hace clic en el botón **[ Iniciar Sesión ]**.
3. Se despliega un **modal flotante translúcido (Glassmorphism)** con los campos de inicio de sesión:
   - Campo **Email** → Escribir: `admin@365soft.com`
   - Campo **Contraseña** → Escribir: `123`
4. Presionar el botón azul **[ INGRESAR ]**.
5. El sistema valida las credenciales y redirige a la **Consola de Administración** (Dashboard General).

---

## CASO DE USO 2: PANEL DE ORQUESTACIÓN GENERAL (DASHBOARD)

### Lo que el administrador ve al ingresar:

**Barra superior fija (TopBar) con:**
- Título: **PANEL ORQUESTADOR** (lado izquierdo).
- Estado de red en tiempo real: *"🟢 Conectado • Latencia: 18ms"*.
- Perfil del Administrador con foto circular, nombre *"Super Orquestador"* y rol *"Global Admin"*.
- **Icono de Campana** 🔔 para notificaciones del sistema.

**Tarjetas de métricas globales (4 columnas):**
- **Total Empresas**: Cantidad de constructoras autorizadas (ej: *12*), con un indicador de crecimiento (+12%).
- **Total Terrenos**: Banco de tierras registradas en el sistema (ej: *2,842*), con indicador de crecimiento (+5.4%).
- **Proyectos Activos**: Cantidad de proyectos inmobiliarios en curso (ej: *48*), con estado "Estable".
- **Plataforma**: Estado del servidor (99.9% de uptime) con indicador de verificación.

**Sección de Módulos Operacionales (Accesos Rápidos):**
Cada módulo tiene una tarjeta ilustrada con un botón para abrir su respectiva pantalla:
1. **Gestión de Constructoras** → Botón: **[ Gestionar Constructoras → ]**
2. **Banco de Terrenos** → Botón: **[ Explorar Tierras → ]**
3. **Gestión de Proyectos** → Botón: **[ Control de Proyectos → ]**

**Sección de Auditoría en Vivo (Live Logs):**
- Tabla inmutable que muestra la actividad del sistema con columnas: `Marca de Tiempo`, `Administrador`, `Acción Realizada`, `Entidad Afectada` y `Estado (Completado / En Espera)`.
- Ejemplo de log: *"09:42:15 UTC — Super Orquestador — Aprobación de Terreno — Plot Alpha-9 — Completado"*.

---

## CASO DE USO 3: REGISTRO DE UN NUEVO TERRENO (3 PASOS)

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Registrar Propiedad ]**.

### Flujo paso a paso:

**Encabezado:**
- Título: **Registrar Propiedad**
- Subtítulo: *"Paso a paso para el alta de un activo en el banco de tierras."*
- Barra de progreso que indica **"Paso X de 03"**.

#### Paso 1: Expediente Legal (Carga de Documentación)
- El administrador ve una zona de carga de archivos (Drag & Drop) con el texto: *"Arrastre el archivo aquí o haga clic para buscar"*.
- El administrador carga los documentos correspondientes (ej: Planos de Zonificación y Certificados Ambientales).
- Al finalizar la carga, presiona el botón azul: **[ CONTINUAR A ESPECIFICACIONES → ]**.

#### Paso 2: Especificaciones Técnicas (Ubicación y Dimensiones)
- Se muestran campos de texto y número para llenar:
  - **Área Total (m²)** → Escribir las dimensiones del lote.
  - **Precio Estimado (USD)** → Escribir la valoración base.
  - **Tipo de Suelo** (Dropdown) → Seleccionar de la lista (ej: *Comercial / Residencial*).
- **Mapa Interactivo (Leaflet)**: El administrador ubica geográficamente el terreno en el mapa haciendo clic sobre la zona exacta. Esto rellena automáticamente los campos de **Latitud** y **Longitud**.
- Presionar el botón azul: **[ CONTINUAR A CREDENCIALES → ]**.

#### Paso 3: Credenciales de Acceso (Usuario Propietario)
- Campo **Email del Propietario** → Escribir el correo del dueño del terreno (ej: `prop@empresa.com`).
- Campo **Contraseña Temporal** → Campo con contraseña autogenerada y un botón de refresco **[ Regenerar ]**.
- Presionar el botón verde de confirmación: **[ ✅ CONFIRMAR Y REGISTRAR ]**.

#### Pantalla de Éxito del Registro:
Al terminar, la pantalla muestra:
- Un ícono de check ✔ verde animado.
- Título: **"¡Propiedad Registrada Exitosamente!"**
- Caja de credenciales generadas para el dueño del terreno:
  - **Usuario / Email**: `prop@empresa.com`
  - **Contraseña**: `123`
- Dos botones de acción rápida:
  - **[ 🗺️ Ver en el Mapa ]** → Abre el mapa de activos para ver el nuevo pin.
  - **[ ➕ Registrar Otro ]** → Limpia el formulario y vuelve al Paso 1.

---

## CASO DE USO 4: VALIDACIÓN Y APROBACIÓN DE TERRENOS POSTULADOS

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Propiedades ]**.

### Flujo paso a paso:
1. El administrador ve una lista de terrenos con su estado: `Verificado`, `En Proceso` o `Pendiente`.
2. Identifica un terreno en estado **Pendiente** y hace clic en el botón **[ Revisar Expediente ]**.
3. Se abre la pantalla de **Validación de Propiedad** con:
   - Galería de fotos subidas por el dueño a Cloudinary.
   - Visor de documentos adjuntos (PDFs de escrituras y certificados).
   - Mapa satelital con los límites geográficos marcados.
4. El administrador evalúa los documentos. Al final del expediente, encuentra dos botones de acción:
   - **[ ❌ Rechazar ]** → Abre un cuadro de texto para especificar las observaciones de rechazo.
   - **[ ✅ Aprobar ]** → Cambia el estado del terreno a **Verificado** y notifica al propietario.

---

## CASO DE USO 5: REGISTRO Y GESTIÓN DE CONSTRUCTORAS

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Registrar Constructora ]**.

### Flujo paso a paso:
1. Se abre el formulario de registro de socio constructor con los siguientes campos:
   - **Razón Social** → Nombre de la empresa constructora.
   - **NIT / RUC** → Registro tributario legal.
   - **Representante Legal** → Nombre del firmante autorizado.
   - **Teléfono y Dirección de Oficina**.
2. Zona de carga de documentos: Registro mercantil, licencias de construcción generales e historial de obras.
3. Campo **Email Corporativo** y **Contraseña** para el acceso del constructor.
4. Hace clic en el botón **[ Registrar Empresa ]**. El socio constructor es guardado en el sistema.

---

## CASO DE USO 6: REGISTRO DE NUEVAS INVERSIONES

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Registrar Inversión ]**.

### Flujo paso a paso:
1. Se abre un formulario para vincular capital a un proyecto específico:
   - **Inversionista** (Dropdown) → Seleccionar el inversionista de la lista.
   - **Proyecto Destino** (Dropdown) → Seleccionar el desarrollo en curso.
   - **Monto de la Transacción** → Escribir el capital depositado (ej: *50,000*).
   - **Tipo de Participación** (Dropdown) → Seleccionar entre *Equity, Deuda o Híbrido*.
2. Botón: **[ Registrar Transacción ]**. El sistema genera el comprobante digital e incrementa automáticamente el capital recaudado del proyecto.

---

## CASO DE USO 7: ARCHIVO DE CUMPLIMIENTO Y LOGS GENERALES

### Navegación:
Desde el menú lateral izquierdo, hacer clic en la opción **[ Cumplimiento Legal ]**.

### Lo que el administrador ve:
- Un panel central que recopila todos los contratos firmados, certificados de auditoría externa e informes de impacto ambiental aprobados.
- Cada elemento de la lista incluye un **Hash de Seguridad** y un enlace **[ Ver en Blockchain ]** que demuestra la trazabilidad y la inmutabilidad de la información del proyecto inmobiliario.
