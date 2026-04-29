# Roadmap Hacia la Versión Funcional (MVP Completo)

Para que la plataforma pase de ser un "registro de datos" a un motor de inversión inmobiliaria completamente funcional, necesitamos conectar el lado del Administrador con el lado del Inversor y gestionar el flujo de dinero. 

A continuación se detalla la planificación dividida en 4 Sprints lógicos.

---

## SPRINT 1: Gestión Operativa del Proyecto (Admin)
*Completar las herramientas para que el Admin gestione la realidad del proyecto una vez que ya está creado.*

### 1.1 Panel de Control del Proyecto Activo
Sacar al proyecto del "Stepper inicial" una vez que está aprobado y llevarlo a un panel con:
- **Módulo de Avances (Bitácora):** Para que el Admin publique "Updates" (Ej. *Día 45: Cimientos terminados* + Galería de fotos). Esto será vital para mantener al inversor informado.
- **Módulo de Legal & Compliance (Due Diligence):** Un checklist interactivo de requisitos legales previos a la construcción (Permiso Ambiental, Escrituras, Licencias).

### 1.2 Transiciones de Estado
- Lógica para cambiar el proyecto de `planificación` a `en_recaudacion`, `en_construccion`, `en_venta` y `completado`.

---

## SPRINT 2: Portal del Inversor y Marketplace (Cliente)
*Construir la cara pública y privada para los clientes que pondrán el dinero.*

### 2.1 Catálogo de Proyectos (Marketplace)
- Listado visual de proyectos disponibles para invertir.
- Filtros por estado, rendimiento esperado (ROI) y ticket mínimo.

### 2.2 Página de Venta del Proyecto (Pitch Deck Digital)
- Aquí vivirá el **Dashboard Premium** del que hablamos (gráficos interactivos, galería, mapa).
- **Simulador Interactivo:** Un slider donde el inversor pone "Quiero invertir $10,000" y ve proyectada su ganancia exacta y fechas de pago.

### 2.3 Onboarding y KYC (Know Your Customer)
- **Crítico legalmente:** Flujo donde el inversor se registra, sube su documento de identidad y valida su información antes de invertir.

---

## SPRINT 3: Motor de Inversiones y Transacciones
*El core financiero: Cómo entra el dinero y cómo se firman los tratos.*

### 3.1 Proceso de Inversión (Checkout)
- Flujo de compra de participaciones (fracciones del proyecto).
- Generación automática de un contrato digital/recibo.
- Pasarela de pago o sistema de subida de comprobantes de transferencia bancaria.

### 3.2 Portafolio del Inversor (Mi Billetera)
- Dashboard privado del inversor donde ve sus inversiones activas.
- Visualización del crecimiento de su dinero y el historial de transacciones.
- Feed de "Actualizaciones" (conectado a la bitácora del Sprint 1.1).

---

## SPRINT 4: Operaciones Financieras y Cierre
*Cómo se paga a los inversores y cómo se cierra el ciclo.*

### 4.1 Distribución de Dividendos (Admin)
- Herramienta para que el Admin declare ganancias (Ej: "Se vendieron 5 unidades") y el sistema calcule cuánto le toca a cada inversor automáticamente.

### 4.2 Notificaciones y Reportes
- Alertas por correo/push para inversores.
- Exportación de reportes contables en Excel/PDF para el Admin.
