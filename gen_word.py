import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# --- Configuración de Estilos ---
style = doc.styles['Normal']
style.font.name = 'Times New Roman'
style.font.size = Pt(12)
style.paragraph_format.line_spacing = 1.5
style.paragraph_format.space_after = Pt(6)

for i in range(1, 4):
    h = doc.styles[f'Heading {i}']
    h.font.name = 'Times New Roman'
    h.font.color.rgb = RGBColor(0, 0, 0)
    h.font.bold = True
    h.font.size = Pt(16 - i * 2)

def add_p(text, bold=False, align=None):
    p = doc.add_paragraph()
    if align: p.alignment = align
    r = p.add_run(text)
    r.bold = bold
    return p

# ===================== PORTADA =====================
for _ in range(4): doc.add_paragraph()
add_p('Departamento de Ingeniería y Ciencias Exactas', True, WD_ALIGN_PARAGRAPH.CENTER)
add_p('Carrera de Ingeniería de Sistemas', True, WD_ALIGN_PARAGRAPH.CENTER)
doc.add_paragraph()
doc.add_paragraph()
add_p('Módulo de optimización heurística basado en algoritmos genéticos para la gestión adaptativa de caché en aplicaciones web con arquitectura orientada a microservicios', True, WD_ALIGN_PARAGRAPH.CENTER)
doc.add_paragraph()
add_p('Perfil de Proyecto de Grado de Licenciatura en Ingeniería de Sistemas', False, WD_ALIGN_PARAGRAPH.CENTER)
for _ in range(4): doc.add_paragraph()
add_p('Cochabamba – Bolivia', False, WD_ALIGN_PARAGRAPH.CENTER)
add_p('Junio de 2026', False, WD_ALIGN_PARAGRAPH.CENTER)
doc.add_page_break()

# ===================== INTRODUCCIÓN =====================
doc.add_heading('INTRODUCCIÓN', level=1)
doc.add_paragraph(
    'Las aplicaciones web empresariales contemporáneas operan bajo arquitecturas orientadas a microservicios '
    'que gestionan volúmenes crecientes de solicitudes concurrentes. Dentro de estas arquitecturas, el sistema '
    'de almacenamiento temporal en memoria, denominado caché, constituye un componente determinante para el '
    'rendimiento operativo del servidor, dado que permite servir datos previamente consultados sin ejecutar '
    'operaciones de lectura repetidas sobre el sistema de base de datos.'
)
doc.add_paragraph(
    'La configuración de los parámetros que gobiernan el comportamiento del caché —específicamente el tiempo '
    'de vida de los datos almacenados (TTL, Time-To-Live), la política de reemplazo cuando la memoria alcanza '
    'su capacidad máxima (evicción) y el dimensionamiento del espacio disponible— se realiza de manera manual '
    'por parte de los equipos de desarrollo de software. Este procedimiento manual establece valores estáticos '
    'que permanecen invariables durante el ciclo de vida de la aplicación, independientemente de las variaciones '
    'que se presenten en los patrones de tráfico.'
)
doc.add_paragraph(
    'El presente proyecto propone el desarrollo de un módulo de software que utiliza algoritmos genéticos —una '
    'técnica de computación evolutiva inspirada en los principios de la selección natural— para la optimización '
    'automática de los parámetros de caché en aplicaciones web desarrolladas con el framework NestJS sobre Node.js. '
    'El módulo opera mediante la evolución iterativa de configuraciones candidatas, evaluando su rendimiento a '
    'través de una función de aptitud multi-objetivo que considera la tasa de acierto del caché, la latencia de '
    'respuesta, el uso de memoria y la carga sobre la base de datos.'
)
doc.add_paragraph(
    'El documento se estructura de la siguiente manera: en la sección de Antecedentes se describe el procedimiento '
    'actual de configuración de caché y se identifican los sistemas tecnológicos disponibles en el mercado; en la '
    'sección de Problemática se identifican las causas y efectos derivados del procedimiento descrito; en la sección '
    'de Objetivos se establece el propósito del desarrollo; en Alcances y Límites se delimita el proyecto; y en '
    'Justificación se fundamenta la pertinencia del desarrollo propuesto.'
)
doc.add_page_break()

# ===================== 1. ANTECEDENTES =====================
doc.add_heading('1.- ANTECEDENTES', level=1)
doc.add_heading('1.1.- Antecedentes Organizacionales', level=2)
doc.add_paragraph(
    'En el desarrollo de aplicaciones web con arquitectura de microservicios, el equipo de ingeniería de software '
    'implementa un sistema de almacenamiento temporal de datos en memoria RAM, denominado caché, con el propósito '
    'de reducir el número de consultas que se ejecutan directamente sobre el servidor de base de datos. El '
    'procedimiento de configuración de este sistema se ejecuta durante la fase de desarrollo e implementación '
    'de la aplicación, y se describe a continuación de manera secuencial.'
)

steps = [
    ('Paso 1 — Selección del motor de caché. ',
     'El equipo de desarrollo selecciona un motor de almacenamiento en memoria como componente de la '
     'arquitectura del sistema. En aplicaciones construidas con el framework NestJS sobre el entorno de '
     'ejecución Node.js, los motores utilizados son Redis (almacén de estructuras de datos en memoria de '
     'código abierto) o el módulo de caché nativo del framework (@nestjs/cache-manager). La selección se '
     'realiza en función de los requerimientos de escala del proyecto y de la experiencia previa del equipo.'),
    ('Paso 2 — Definición del valor de TTL (Time-To-Live). ',
     'El desarrollador establece un valor numérico que determina la cantidad de segundos que un dato permanecerá '
     'almacenado en el caché antes de ser eliminado automáticamente. Este valor se codifica de manera estática '
     'en el código fuente de la aplicación. Los valores comúnmente utilizados en la industria son 30, 60 o 300 '
     'segundos, seleccionados a partir de recomendaciones genéricas de la documentación técnica del motor de caché '
     'o de la experiencia del desarrollador. Una vez establecido, este valor se aplica de manera uniforme a todos '
     'los tipos de datos almacenados en el caché, sin distinción por frecuencia de acceso, tamaño del objeto '
     'o criticidad de la información.'),
    ('Paso 3 — Selección de la política de evicción. ',
     'El desarrollador configura la estrategia que el sistema utilizará para decidir qué datos eliminar del caché '
     'cuando la memoria asignada alcance su capacidad máxima. Las políticas disponibles en los motores de caché '
     'incluyen: LRU (Least Recently Used), que elimina el dato que lleva más tiempo sin ser consultado; LFU (Least '
     'Frequently Used), que elimina el dato con menor número de accesos acumulados; y Random, que selecciona un '
     'dato al azar para su eliminación. En la práctica, la política LRU es seleccionada en la mayoría de las '
     'implementaciones por ser la opción predeterminada de los motores de caché, sin que se realice un análisis '
     'comparativo de su idoneidad para el patrón de tráfico específico de la aplicación.'),
    ('Paso 4 — Dimensionamiento del espacio de almacenamiento. ',
     'El administrador de sistemas asigna una cantidad fija de memoria RAM para el almacén de caché. Esta '
     'asignación se determina mediante una estimación del volumen de datos que la aplicación procesará durante '
     'los periodos de carga pico. En entornos de infraestructura en la nube, el dimensionamiento se traduce '
     'directamente en el tipo de instancia contratada (por ejemplo, cache.t3.micro con 0.5 GB o cache.r6g.large '
     'con 13.07 GB en Amazon ElastiCache), lo que establece un costo mensual fijo independientemente del uso '
     'real del recurso.'),
    ('Paso 5 — Despliegue y operación continua. ',
     'Una vez configurados los parámetros (TTL, política de evicción y tamaño), la aplicación se despliega en '
     'el entorno de producción. A partir de este punto, los valores de configuración permanecen estáticos durante '
     'todo el ciclo de vida de la aplicación. El equipo de operaciones monitorea indicadores generales del servidor '
     '(uso de CPU, memoria disponible, tiempos de respuesta) mediante herramientas de observabilidad; sin embargo, '
     'los parámetros específicos del caché no son objeto de revisión periódica ni de ajuste sistemático.'),
    ('Paso 6 — Intervención reactiva ante incidentes. ',
     'Cuando se presenta una degradación del rendimiento del sistema —manifestada en incrementos de la latencia '
     'de respuesta o en la saturación del servidor de base de datos—, el equipo de ingeniería revisa los parámetros '
     'de caché como parte del diagnóstico. En esta revisión, el desarrollador modifica manualmente los valores de '
     'TTL o el tamaño del almacén, despliega una nueva versión de la aplicación con los valores actualizados y '
     'observa el comportamiento del sistema durante las horas o días siguientes para determinar si el ajuste '
     'produjo una mejora. Este ciclo de ajuste manual se repite cada vez que se presenta un incidente de rendimiento.')
]

for title, desc in steps:
    p = doc.add_paragraph()
    r = p.add_run(title)
    r.bold = True
    p.add_run(desc)

doc.add_paragraph(
    'El procedimiento descrito se ejecuta de manera secuencial en cada proyecto de desarrollo de software que '
    'incorpora un componente de caché. Los valores de configuración establecidos en el Paso 2 (TTL), Paso 3 '
    '(política de evicción) y Paso 4 (tamaño) constituyen parámetros interdependientes cuyo efecto combinado '
    'sobre el rendimiento del sistema depende de las características del patrón de tráfico que recibe la '
    'aplicación en cada momento de su operación.'
)
doc.add_page_break()

# ===================== 1.2 ANTECEDENTES TECNOLÓGICOS =====================
doc.add_heading('1.2.- Antecedentes Tecnológicos', level=2)
doc.add_paragraph(
    'Con el propósito de identificar soluciones tecnológicas disponibles en el mercado que aborden la gestión '
    'de caché en aplicaciones web, se realizó una revisión de los sistemas más relevantes. A continuación se '
    'describen tres sistemas, sus funcionalidades y las condiciones que limitan su adopción.'
)

# Sistema 1
doc.add_heading('Sistema 1: Redis con configuración manual', level=3)
doc.add_paragraph(
    'Redis es un almacén de estructuras de datos en memoria de código abierto, desarrollado y mantenido por '
    'Redis Ltd. (Redis Ltd., 2024). Opera como un servidor independiente al que la aplicación se conecta '
    'mediante un protocolo de red (TCP). Permite almacenar datos en formatos de cadenas de texto, listas, '
    'conjuntos y tablas hash, con soporte para la asignación de valores de TTL por cada clave individual.'
)
doc.add_paragraph(
    'Funcionalidades: Redis ofrece seis políticas de evicción configurables (volatile-lru, allkeys-lru, '
    'volatile-lfu, allkeys-lfu, volatile-random, volatile-ttl), persistencia opcional a disco, replicación '
    'maestro-esclavo y soporte para clustering con fragmentación automática de datos.'
)
doc.add_paragraph(
    'Condiciones de uso: La configuración de los parámetros de caché (TTL, política de evicción, memoria '
    'máxima) se realiza de manera manual mediante el archivo redis.conf o mediante comandos administrativos '
    'en tiempo de ejecución. Redis no incorpora mecanismos de auto-ajuste que modifiquen estos parámetros en '
    'función del patrón de tráfico observado. Cada modificación de configuración requiere intervención directa '
    'del administrador de sistemas.'
)

# Sistema 2
doc.add_heading('Sistema 2: Amazon ElastiCache', level=3)
doc.add_paragraph(
    'Amazon ElastiCache es un servicio de caché gestionado en la nube ofrecido por Amazon Web Services (AWS, '
    '2024). Soporta Redis y Memcached como motores subyacentes y ofrece aprovisionamiento automatizado de '
    'infraestructura, incluyendo la creación de nodos, la configuración de réplicas de lectura y la gestión '
    'de actualizaciones de software del motor.'
)
doc.add_paragraph(
    'Funcionalidades: ElastiCache proporciona escalamiento automático del número de nodos y réplicas en función '
    'de la demanda, monitoreo integrado mediante Amazon CloudWatch, respaldo automático de datos y cifrado en '
    'tránsito y en reposo.'
)
doc.add_paragraph(
    'Condiciones de uso: El escalamiento automático que ofrece ElastiCache opera exclusivamente a nivel de '
    'infraestructura (agregar o remover nodos de cómputo). Los parámetros internos del caché —TTL de los datos, '
    'política de evicción y distribución del espacio entre diferentes tipos de datos— continúan siendo '
    'responsabilidad del equipo de desarrollo. El servicio tiene un costo mínimo de 12.41 USD mensuales '
    '(instancia cache.t3.micro) y puede superar los 500 USD mensuales en configuraciones de producción. '
    'No incluye optimización algorítmica de los parámetros de caché.'
)

# Sistema 3
doc.add_heading('Sistema 3: Caffeine (Biblioteca Java)', level=3)
doc.add_paragraph(
    'Caffeine es una biblioteca de caché en memoria de alto rendimiento para el lenguaje Java, desarrollada '
    'por Ben Manes (Einziger et al., 2017). Implementa una política de evicción denominada W-TinyLFU (Window '
    'Tiny Least Frequently Used), que combina un filtro de admisión probabilístico con una segmentación de '
    'ventana de recencia para decidir qué datos mantener en memoria.'
)
doc.add_paragraph(
    'Funcionalidades: Caffeine ofrece una política de evicción adaptativa que selecciona automáticamente qué '
    'datos retener en memoria en función de la frecuencia y recencia de acceso. Soporta carga asíncrona de '
    'datos, estadísticas de rendimiento integradas y límites de tamaño configurables por número de entradas '
    'o por peso estimado en bytes.'
)
doc.add_paragraph(
    'Condiciones de uso: La optimización adaptativa de Caffeine se limita exclusivamente a la política de '
    'evicción. Los valores de TTL y el dimensionamiento del almacén de caché continúan siendo parámetros '
    'estáticos definidos por el desarrollador. Caffeine está implementado para el ecosistema Java (JVM) y '
    'no dispone de una versión nativa para Node.js o JavaScript, lo que impide su integración directa en '
    'aplicaciones desarrolladas con NestJS.'
)

# Tabla comparativa
doc.add_paragraph()
p = doc.add_paragraph()
r = p.add_run('Tabla 1')
r.bold = True
p.alignment = WD_ALIGN_PARAGRAPH.CENTER

p = doc.add_paragraph()
r = p.add_run('Evaluación de sistemas tecnológicos para gestión de caché en aplicaciones web')
r.italic = True
p.alignment = WD_ALIGN_PARAGRAPH.CENTER

table = doc.add_table(rows=5, cols=6)
table.style = 'Table Grid'
headers = ['Sistema', '¿Auto-ajusta TTL?', '¿Auto-ajusta evicción?', '¿Optimización multi-objetivo?', '¿Disponible para Node.js?', 'Costo (USD/mes)']
for i, h in enumerate(headers):
    table.rows[0].cells[i].text = h
    for prg in table.rows[0].cells[i].paragraphs:
        for run in prg.runs:
            run.bold = True
            run.font.size = Pt(9)

data = [
    ['Redis (manual)', 'No', 'No', 'No', 'Sí', '0 (OSS)'],
    ['ElastiCache', 'No', 'No', 'No', 'Sí', '>12.41'],
    ['Caffeine', 'No', 'Parcial (W-TinyLFU)', 'No', 'No', '0 (OSS)'],
    ['GA-Cache (propuesto)', 'Sí', 'Sí', 'Sí', 'Sí', '0'],
]
for ri, row in enumerate(data):
    for ci, val in enumerate(row):
        table.rows[ri+1].cells[ci].text = val
        for prg in table.rows[ri+1].cells[ci].paragraphs:
            for run in prg.runs:
                run.font.size = Pt(9)

add_p('Fuente: Elaboración propia a partir de documentación técnica oficial de cada sistema.', False).runs[0].italic = True
doc.add_page_break()

# ===================== 2. PROBLEMÁTICA =====================
doc.add_heading('2.- PROBLEMÁTICA', level=1)
doc.add_heading('2.1.- Situación Problemática', level=2)

probs = [
    ('P1. Configuración estática del TTL ante tráfico variable. ',
     'Causa: El valor de TTL de la caché permanece invariable y se codifica de manera estática durante la fase de desarrollo de la aplicación web, de acuerdo con el procedimiento del Paso 2. '
     'Efecto: En periodos donde la tasa de actualización de datos se intensifica (patrones drift) o se focaliza en recursos específicos (patrones hotspot), la inmutabilidad del parámetro provoca que el sistema sirva datos inconsistentes por exceso de persistencia en caché, o alternativamente, sature el servidor de base de datos con consultas redundantes debido a la expiración prematura de claves que registran accesos frecuentes.'),
    ('P2. Selección de política de evicción sin análisis del patrón de tráfico. ',
     'Causa: El desarrollador selecciona una política de evicción única y predeterminada (generalmente LRU) durante la inicialización del motor de caché, conforme a la acción establecida en el Paso 3. '
     'Efecto: Al presentarse patrones de solicitudes compuestos por picos de tráfico altamente repetitivos de un subconjunto específico de claves (patrones burst), el sistema desaloja información con alta probabilidad de reutilización futura para dar paso a consultas esporádicas pero recientes, reduciendo la tasa de acierto global del caché y aumentando la latencia de respuesta global.'),
    ('P3. Dimensionamiento fijo del almacén de caché. ',
     'Causa: La memoria máxima utilizable por el sistema de caché se asigna de manera inalterable antes del despliegue en producción basándose en estimaciones heurísticas de carga pico, según el Paso 4. '
     'Efecto: En momentos de tráfico significativamente inferior a la carga prevista, los recursos asignados permanecen ociosos representando un desperdicio financiero en infraestructura cloud, mientras que ante incrementos repentinos de tráfico, la memoria se satura y gatilla procesos masivos de evicción que degradan la disponibilidad del sistema.'),
    ('P4. Ciclo reactivo de ajuste manual de parámetros. ',
     'Causa: El equipo de desarrollo e infraestructura realiza el reajuste de la caché de manera estrictamente reactiva ante alertas de caída de rendimiento o saturación de base de datos en producción, conforme al Paso 6. '
     'Efecto: El tiempo necesario para identificar la degradación del servicio, estimar empíricamente nuevos valores de TTL/tamaño, y efectuar el redespliegue de la aplicación prolonga las ventanas de indisponibilidad y latencia elevada, lo que afecta el SLA del sistema y sobrecarga de trabajo al personal técnico.')
]

for title, desc in probs:
    p = doc.add_paragraph()
    r = p.add_run(title)
    r.bold = True
    p.add_run(desc)

doc.add_heading('2.2.- Formulación del Problema', level=2)
doc.add_paragraph(
    'Los procedimientos manuales de configuración y ajuste de los parámetros de caché en el proceso de gestión '
    'de rendimiento de aplicaciones web con arquitectura de microservicios no permiten la adaptación dinámica '
    'de dichos parámetros a las variaciones de los patrones de tráfico, generando un uso ineficiente de los '
    'recursos de infraestructura que incrementa los costos operativos y reduce la calidad del servicio entregado '
    'al usuario final.'
)
doc.add_page_break()

# ===================== 3. OBJETIVOS =====================
doc.add_heading('3.- OBJETIVOS', level=1)
doc.add_heading('3.1.- Objetivo General', level=2)
doc.add_paragraph(
    'Desarrollar un módulo de optimización heurística basado en algoritmos genéticos para la gestión adaptativa de caché '
    'en el proceso de gestión de rendimiento de aplicaciones web con arquitectura orientada a microservicios.'
)

doc.add_heading('3.2.- Objetivos Específicos', level=2)
objectives = [
    'Establecer la arquitectura del módulo de optimización evolutiva, definiendo las estructuras de datos para cromosomas, fitness multi-objetivo y operadores genéticos.',
    'Desarrollar el motor del algoritmo genético que implemente procesos de selección, cruzamiento y mutación para la optimización de parámetros de caché.',
    'Implementar la capa de caché adaptativa multinivel L1/L2 compatible con el framework NestJS que permita la actualización de parámetros en tiempo de ejecución.',
    'Desarrollar un sistema de telemetría de alto rendimiento basado en estructuras de búfer circular para la recopilación de métricas sin bloqueo del bucle de eventos.',
    'Diseñar un framework de benchmarking que simule patrones de tráfico compuesto, drift, burst y uniforme bajo condiciones de tiempo virtual.',
    'Integrar el dashboard de visualización en tiempo real mediante canales de comunicación WebSocket para monitorizar el proceso de convergencia evolutiva.',
    'Ejecutar pruebas experimentales del sistema integrado para evaluar cuantitativamente la mejora del hit rate y la reducción del consumo de base de datos.'
]
for obj in objectives:
    doc.add_paragraph(obj, style='List Bullet')

doc.add_page_break()

# ===================== 4. ALCANCES =====================
doc.add_heading('4.- ALCANCES', level=1)
scopes = [
    'Integración transparente: El módulo se integrará a nivel de microservicio como un decorador de NestJS (@EvolutionaryCache) e interceptor de peticiones sin alterar la lógica interna de los controladores ni servicios existentes.',
    'Parámetros optimizados: El algoritmo genético sintonizará de manera dinámica el TTL (dentro de un rango de 5 a 600 segundos), la política de evicción (alternando entre LRU, LFU y ARC) y el tamaño límite del almacén de almacenamiento.',
    'Arquitectura de doble capa: Implementación de almacenamiento local L1 en memoria RAM de la instancia de la aplicación y una simulación configurable de base de datos/L2 con retrasos de red artificiales para análisis controlado.',
    'Monitoreo pasivo: Telemetría basada en ring buffers que capture el historial de aciertos, fallos y latencias sin degradar el rendimiento del hilo único de Node.js.',
    'Entorno de pruebas virtuales: Inclusión de un simulador de tráfico capaz de avanzar el tiempo de manera virtual para realizar evaluaciones complejas equivalentes a horas de tráfico en segundos de ejecución real.',
    'Patrones de tráfico simulados: Pruebas estructuradas en base a cuatro perfiles (Uniforme, Hotspot 80/20, Burst con spikes y Drift evolutivo) más el escenario Composite que unifica todos en un ciclo simulado de producción.',
    'Dashboard web: Interfaz SPA en tiempo real usando Chart.js y WebSockets para visualizar las gráficas de fitness promedio, mejor fitness, hit rate por generación y la configuración del genoma activo.',
    'Genoma semilla (Cold Start): Carga de configuraciones optimizadas por defecto como población inicial del algoritmo genético para asegurar que el sistema no inicie en un estado subóptimo o peligroso.'
]
for sc in scopes:
    doc.add_paragraph(sc, style='List Bullet')

doc.add_page_break()

# ===================== 5. LÍMITES =====================
doc.add_heading('5.- LÍMITES', level=1)
limits = [
    'Entorno tecnológico restrictivo: El desarrollo está diseñado e implementado de manera exclusiva para el framework NestJS y el entorno de ejecución Node.js, no garantizando compatibilidad con otras plataformas como Spring Boot, .NET Core o Django.',
    'Simulación de almacenamiento L2: La capa L2 del caché opera de forma simulada en memoria RAM y no interactúa con una instalación real de Redis, Memcached o bases de datos no relacionales externas.',
    'Ejecución síncrona en el bucle principal: En el prototipo implementado, el cálculo evolutivo del motor GA se procesa en el hilo principal de la aplicación web, no utilizando Worker Threads para delegar la carga de cómputo.',
    'Ausencia de persistencia a disco: Los genomas evolucionados y el historial de rendimiento acumulado se mantendrán únicamente en memoria volátil, perdiéndose en caso de apagado o reinicio del proceso del servidor.',
    'Modelación financiera referencial: Los reportes de ahorro económico se estiman mediante fórmulas lineales simplificadas con costes estándar de AWS, no reflejando fluctuaciones de tarifas reales, impuestos o consumos dinámicos en la nube.',
    'Foco en lecturas: La optimización adaptativa del módulo está orientada a operaciones de lectura idempotentes, no gestionando estrategias de escritura complejas (Write-through o Write-behind).'
]
for lm in limits:
    doc.add_paragraph(lm, style='List Bullet')

doc.add_page_break()

# ===================== 6. JUSTIFICACIÓN =====================
doc.add_heading('6.- JUSTIFICACIÓN', level=1)
doc.add_paragraph(
    'Justificación Técnica: El desarrollo propuesto aporta una solución al problema de la rigidez de la configuración '
    'manual y estática de la caché. Al delegar la búsqueda paramétrica a un algoritmo genético de autotuning, el sistema '
    'descubre de manera automática la política de evicción idónea y la ventana de TTL óptima en respuesta al patrón de tráfico actual. '
    'Esto se evidencia en los benchmarks del prototipo, donde el sistema migró automáticamente hacia esquemas LFU o ARC bajo tráfico de hotspot, '
    'logrando reducir la latencia de procesamiento promedio a 9.2 ms en comparación a los 10.8 ms de una configuración estática.'
)
doc.add_paragraph(
    'Justificación Económica: En términos de costos operativos de infraestructura en la nube, la disminución en el consumo '
    'de recursos del servidor de base de datos se traduce en un ahorro directo medible. Las evaluaciones del sistema demostraron que '
    'bajo un patrón compuesto de tráfico web, GA-Cache disminuyó las peticiones al motor de persistencia de 2,634 a 2,375 consultas (una '
    'reducción del 9.8% sobre el modelo tradicional de caché), proyectando un ahorro económico neto estimado de entre $14.90 y $21.46 USD '
    'mensuales por servidor aprovisionado.'
)
doc.add_paragraph(
    'Justificación Académica: La investigación contribuye de manera directa a la aplicación práctica de la computación evolutiva '
    'en problemas prácticos de optimización de sistemas en tiempo de ejecución. Permite validar cómo los algoritmos genéticos pueden ser '
    'embebidos en arquitecturas asíncronas modernas basadas en Node.js de manera segura, abriendo una línea de investigación en '
    'sintonización heurística en tiempo real para otros recursos del sistema, tales como límites en pools de conexión y balanceadores de carga.'
)
doc.add_page_break()

# ===================== BIBLIOGRAFÍA =====================
doc.add_heading('BIBLIOGRAFÍA', level=1)
refs = [
    'Amazon Web Services. (2024). Amazon ElastiCache – In-memory caching service. https://aws.amazon.com/elasticache/',
    'Beckmann, N., Chen, H., & Cidon, A. (2018). LHD: Improving cache hit rate by maximizing hit density. 15th USENIX Symposium on Networked Systems Design and Implementation (NSDI 18), 389–403.',
    'Berger, D. S., Sitaraman, R. K., & Harchol-Balter, M. (2019). AdaptSize: Orchestrating the hot object memory cache in a content delivery network. ACM Transactions on Networking, 27(2), 1–14. https://doi.org/10.1145/3323001',
    'Einziger, G., Friedman, R., & Manes, B. (2017). TinyLFU: A highly efficient cache admission policy. ACM Transactions on Storage, 13(4), 1–31. https://doi.org/10.1145/3149371',
    'Goldberg, D. E. (1989). Genetic Algorithms in Search, Optimization, and Machine Learning. Addison-Wesley.',
    'Holland, J. H. (1975). Adaptation in Natural and Artificial Systems. University of Michigan Press.',
    'Merelo, J. J., Castillo, P. A., Mora, A. M., Fernández-Ares, A., Esparcia-Alcázar, A. I., Cotta, C., & Rico, N. (2017). NodEO, a multi-paradigm distributed evolutionary algorithm platform in JavaScript. Proceedings of the Genetic and Evolutionary Computation Conference Companion, 1155–1162. https://doi.org/10.1145/3067695.3082468',
    'Redis Ltd. (2024). Redis – The Real-time Data Platform. https://redis.io/documentation'
]
for r in refs:
    p = doc.add_paragraph(r)
    p.paragraph_format.left_indent = Cm(1.27)
    p.paragraph_format.first_line_indent = Cm(-1.27)

doc.add_page_break()

# ===================== ANEXOS =====================
doc.add_heading('ANEXOS', level=1)
doc.add_heading('Anexo 1 — Resultados de Pruebas de Carga de GA-Cache', level=2)

table_anexo = doc.add_table(rows=5, cols=6)
table_anexo.style = 'Table Grid'
cols = ['Patrón', 'Métrica', 'Sin Caché', 'Caché Estático', 'GA-Cache', 'Δ vs Estático']
for i, col in enumerate(cols):
    table_anexo.rows[0].cells[i].text = col
    for p in table_anexo.rows[0].cells[i].paragraphs:
        for r in p.runs: r.bold = True; r.font.size = Pt(9)

results_data = [
    ['Composite', 'Hit Rate', '0.0%', '67.1%', '70.3%', '+3.2%'],
    ['', 'DB Queries', '8,000', '2,634', '2,375', '-9.8%'],
    ['Drift', 'Hit Rate', '0.0%', '67.2%', '71.0%', '+3.7%'],
    ['', 'DB Queries', '10,000', '2,822', '2,324', '-17.7%']
]
for ri, row in enumerate(results_data):
    for ci, val in enumerate(row):
        table_anexo.rows[ri+1].cells[ci].text = val
        for p in table_anexo.rows[ri+1].cells[ci].paragraphs:
            for r in p.runs: r.font.size = Pt(9)

add_p('Fuente: Datos generados mediante el framework de simulación interna del prototipo GA-Cache.', False).runs[0].italic = True

# Guardar
path = r'c:\Users\ELITEBOOK\Desktop\Pasantía Programas\365-Desarrollo-Inmobiliario\GA_Cache_Perfil_Proyecto_Grado.docx'
doc.save(path)
print(f'Documento Word generado en: {path}')
