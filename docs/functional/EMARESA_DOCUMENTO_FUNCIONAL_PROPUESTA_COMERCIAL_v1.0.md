# EMARESA Clima
## Documento funcional y alcance para propuesta comercial

**Versión:** 1.0  
**Fecha:** 1 de septiembre de 2026  
**Destinatario:** Claude, para elaboración de propuesta comercial  
**Producto:** Plataforma de analítica de clima organizacional EMARESA  

---

## 1. Propósito del documento

Este documento describe el producto, su alcance funcional, los flujos de uso, las integraciones, las condiciones técnicas y la evolución propuesta de la plataforma EMARESA Clima.

Debe utilizarse como insumo para preparar una propuesta comercial clara y realista que incluya:

- alcance de la solución;
- entregables;
- fases de implementación;
- supuestos y dependencias;
- capacitación y soporte;
- operación y actualización de datos;
- alternativas de evolución;
- campos para completar con precio, plazo y condiciones comerciales.

La propuesta debe presentar EMARESA Clima como una plataforma interna de toma de decisiones sobre clima organizacional, y no únicamente como un tablero de indicadores.

### 1.1 Criterio de lectura

En cada módulo se distingue entre:

- **Implementado en el demo:** comportamiento visible o ya construido en la versión actual.
- **Evolución propuesta:** capacidad que debe ser considerada en el producto objetivo, en producción o en una fase posterior.

Cuando una capacidad no esté confirmada como productiva, la propuesta debe formularla como alcance sujeto a validación, sin presentarla como una integración ya operativa.

---

## 2. Resumen ejecutivo

EMARESA Clima es una plataforma web para consultar, explorar y comunicar resultados de clima organizacional a distintos niveles de la estructura corporativa.

La solución permite pasar desde una visión ejecutiva del Grupo EMARESA hasta el detalle de una compañía, unidad de negocio, división legal, área, subárea y, cuando la fuente lo permita, preguntas o notas agregadas. La navegación está diseñada como un drill-down: cada indicador, unidad o nodo debe conducir al detalle que explica su resultado.

El sistema integra una fotografía organizacional proveniente de BUK y la combina con los resultados de mediciones de clima. Sobre esta base ofrece:

- tablero ejecutivo;
- ranking de unidades de negocio;
- análisis de categorías y preguntas;
- exploración de estructura BUK;
- informes de clima en PDF;
- comparaciones de unidades, categorías y períodos;
- Mentat, copiloto conversacional para consultar los datos;
- exportación de gráficos y tablas generados por Mentat como informes PDF diseñados;
- actualización diaria programada de la base organizacional.

La propuesta comercial debe considerar una solución con una primera versión operativa y una ruta de evolución hacia mayor automatización, seguridad, trazabilidad y analítica histórica.

---

## 3. Problema y oportunidad

### 3.1 Situación a resolver

Los resultados de clima suelen distribuirse en informes estáticos y en múltiples niveles de análisis. Esto dificulta:

- identificar rápidamente dónde están los mejores y peores resultados;
- bajar desde el resultado corporativo a las unidades más pequeñas;
- entender qué categorías o preguntas explican una brecha;
- comparar unidades con criterios consistentes;
- reutilizar los datos para conversaciones ejecutivas;
- producir informes diferenciados por unidad sin trabajo manual repetitivo;
- mantener actualizada la estructura organizacional.

### 3.2 Oportunidad

EMARESA puede centralizar la consulta del clima organizacional en una experiencia única, elegante y de baja fricción. La plataforma debe convertir la información de clima en una herramienta cotidiana para:

- priorizar oportunidades de mejora;
- preparar reuniones de gestión;
- comunicar resultados a cada unidad;
- detectar diferencias entre áreas y subáreas;
- hacer seguimiento de la evolución histórica;
- responder preguntas de negocio sin depender de una búsqueda manual en archivos.

---

## 4. Objetivos de negocio

1. Dar a la dirección una visión rápida y confiable del clima organizacional.
2. Permitir drill-down desde el Grupo EMARESA hasta las unidades organizacionales más pequeñas disponibles.
3. Entregar a cada unidad de negocio un espacio propio con sus indicadores, categorías, preguntas y acceso a su informe.
4. Reducir el tiempo necesario para preparar análisis y presentaciones.
5. Estandarizar la generación y distribución de informes de clima.
6. Facilitar comparaciones entre unidades, categorías y períodos.
7. Mantener sincronizada la estructura organizacional con BUK.
8. Proteger la privacidad de las personas mostrando información agregada y evitando datos personales.
9. Incorporar un copiloto que permita explorar la información utilizando lenguaje natural.

### 4.1 Indicadores de éxito sugeridos

Estos indicadores son sugeridos para la propuesta y deben acordarse con EMARESA:

- tiempo para encontrar el resultado de una unidad: menor a 30 segundos;
- tiempo para obtener un comparativo de dos unidades: menor a 1 minuto;
- generación de un informe de unidad: menor a 2 minutos;
- disponibilidad de la actualización organizacional posterior a la ejecución programada;
- porcentaje de preguntas frecuentes resueltas por Mentat con datos trazables;
- disminución del trabajo manual de consolidación y preparación de reportes.

---

## 5. Usuarios y roles

### 5.1 Dirección y gerencia

Necesitan ver el resultado global, la participación, las brechas y el ranking de unidades. Requieren exportar información para reuniones y presentaciones.

### 5.2 Gestión Corporativa / Recursos Humanos

Necesitan revisar categorías, preguntas, unidades, divisiones legales, estructura BUK y resultados comparativos. También necesitan generar informes y preparar análisis de seguimiento.

### 5.3 Responsables de unidades de negocio

Necesitan consultar únicamente, o prioritariamente, la información de su unidad, revisar sus resultados y descargar el informe correspondiente.

### 5.4 Administradores de la plataforma

Necesitan supervisar la actualización de datos, revisar errores de sincronización, gestionar períodos, validar fuentes y controlar permisos.

### 5.5 Usuarios de consulta

Necesitan navegar por los resultados autorizados y utilizar Mentat para responder preguntas sobre el sistema.

### 5.6 Modelo de permisos propuesto

La propuesta debe contemplar al menos los siguientes niveles:

- **Administrador:** configuración, sincronización, fuentes, períodos y permisos.
- **Corporativo:** acceso a Grupo EMARESA, todas las unidades y reportes autorizados.
- **Unidad de negocio:** acceso a su unidad y a los niveles inferiores permitidos.
- **Consulta:** acceso de solo lectura a las vistas autorizadas.

La implementación final de permisos, autenticación y segmentación por usuario queda sujeta a la definición de EMARESA.

---

## 6. Alcance funcional

### 6.1 Inicio y tablero ejecutivo

La página inicial debe concentrar la lectura ejecutiva del período seleccionado, con una jerarquía visual clara y sin repetir indicadores en distintos lugares.

### Indicadores principales

- resultado global de clima;
- resultado de Gestión Corporativa;
- participación;
- cantidad de unidades de negocio;
- cantidad de categorías medidas;
- cantidad de preguntas o ítems disponibles.

### Comportamiento

- Cada KPI debe ser clickeable.
- Al hacer clic debe abrir el detalle correspondiente, mediante navegación, modal o panel lateral según el caso.
- El detalle debe explicar el valor, la fuente, el período y las dimensiones asociadas.
- Los indicadores no deben aparecer duplicados sin una razón funcional explícita.
- El usuario debe poder volver al contexto anterior sin perder la selección.

### Implementado en el demo

Existe un tablero inicial con resultado global, Gestión Corporativa, participación, unidades, categorías y preguntas.

### Evolución propuesta

- filtros globales por período, compañía y unidad;
- variación contra período anterior;
- alertas de cambios relevantes;
- indicadores de cobertura y calidad de datos;
- permisos según perfil.

---

### 6.2 Drill-down organizacional

La plataforma debe permitir bajar progresivamente por la estructura:

**Grupo EMARESA -> compañía -> unidad de negocio -> división legal -> área -> subárea**

La profundidad exacta dependerá de la relación disponible entre la medición de clima y la estructura de BUK.

### Requisitos de navegación

- breadcrumb o ruta visible;
- nombre del nivel actual;
- botón claro para volver al nivel anterior;
- resumen del nivel seleccionado;
- indicadores comparables con el nivel padre;
- lista de nodos hijos ordenable y filtrable;
- acceso a notas o resultados agregados cuando existan;
- estado vacío explícito cuando el nivel no tenga medición asociada.

### Unidad de negocio

Cada unidad debe mostrar:

- resultado de clima;
- resultado de Gestión Corporativa, cuando corresponda;
- participación;
- número de divisiones legales;
- posición en el grupo;
- categorías medidas;
- preguntas o ítems disponibles;
- comparación con el promedio del grupo;
- opción **Generar informe de clima**.

### División legal

Cada división debe mostrar, cuando los datos estén disponibles:

- resultado de clima;
- participación;
- cantidad de respuestas;
- comparación con divisiones hermanas;
- acceso a los niveles inferiores de la estructura.

En la versión actual, la división legal puede no tener categorías o preguntas propias. La interfaz debe indicarlo claramente y no mostrar módulos vacíos como si fueran resultados disponibles.

### Área y subárea

El producto objetivo debe soportar:

- resultado agregado del área o subárea, si existe;
- cantidad de personas o respuestas agregadas;
- notas disponibles;
- comparación con otras áreas del mismo nivel;
- drill-down a los nodos hijos;
- estado de información no disponible.

No se deben mostrar nombres, RUT, correos u otros datos personales en este módulo.

---

### 6.3 Estructura organizacional desde BUK

La plataforma debe incorporar la estructura organizacional proveniente de BUK para que el usuario pueda entender el universo de análisis, aunque no todos los nodos tengan un resultado de clima asociado.

### Información requerida

- compañías;
- áreas;
- subáreas;
- relaciones jerárquicas;
- conteos agregados de personas, cuando BUK los entregue;
- fecha y hora de la última sincronización;
- estado de la fuente.

### Reglas de presentación

- diferenciar estructura organizacional de resultado de clima;
- informar cuando un nodo existe en BUK pero no tiene medición asociada;
- no inferir una nota de clima a partir del número de personas;
- permitir buscar y expandir la estructura;
- mostrar la fuente y la fecha de actualización.

### Implementado en el demo

Existe una vista de organización con árbol compañía -> área -> subárea y conteos agregados provenientes de un snapshot de BUK.

### Evolución propuesta

- sincronización incremental o completa según capacidad de BUK;
- bitácora de sincronizaciones;
- alertas cuando cambie la estructura;
- asociación administrable entre nodos BUK y unidades de medición;
- permisos por compañía, área o subárea.

---

### 6.4 Resultados de clima

### Dimensiones mínimas

- resultado global;
- Gestión Corporativa;
- unidad de negocio;
- división legal;
- categoría;
- pregunta o ítem;
- período;
- participación;
- respuestas y universo enviado, cuando estén disponibles.

### Categorías

El sistema debe permitir ordenar categorías por resultado, identificar fortalezas y oportunidades, y abrir el detalle de las preguntas que componen cada categoría.

### Preguntas

El sistema debe permitir revisar la nota por pregunta o ítem cuando exista ese dato. Cada pregunta debe conservar su categoría y período.

### Reglas de interpretación

- una nota debe identificar siempre la métrica y el período;
- no deben mezclarse resultados de clima con simples nodos de la estructura BUK;
- si una dimensión no tiene nota, la respuesta debe decirlo explícitamente;
- los porcentajes deben mantener una precisión consistente;
- los rankings deben indicar si están ordenados de mayor a menor o de menor a mayor.

---

### 6.5 Informes de clima en PDF

Cada unidad de negocio debe tener una opción visible para **Generar informe de clima**.

### Informe oficial de unidad

El informe de unidad debe conservar el formato de los informes de referencia entregados por EMARESA, incluyendo:

- identidad visual y logo oficial;
- portada;
- período de medición;
- nombre de la compañía o unidad;
- resultado de clima;
- participación;
- categorías;
- preguntas o dimensiones disponibles;
- comparaciones que formen parte del formato oficial;
- conclusiones o secciones definidas por EMARESA.

El informe debe generarse con los datos de la unidad seleccionada y no con datos globales reutilizados.

### Informes de referencia

Los informes entregados por EMARESA son la referencia de formato para la salida oficial. En la versión actual del demo se utilizan como referencia y existen ejemplares publicados, entre ellos:

- informe de Gestión Corporativa S1 2026;
- informe de A&J S1 2026.

La propuesta debe considerar la parametrización del formato para las unidades que EMARESA defina.

### Informe analítico de Mentat

Cuando Mentat genere una comparación, gráfico o tabla, el usuario debe poder descargar un PDF diseñado con:

- título de la consulta;
- fecha de generación;
- período de datos;
- contexto seleccionado;
- texto ejecutivo breve;
- gráfico o tabla;
- fuente de datos;
- notas metodológicas;
- pie de página e identidad visual EMARESA.

Este informe analítico es una salida distinta del informe oficial de clima. La propuesta debe dejar clara esta diferencia para no confundir ambos formatos.

### Requisitos de descarga

- descarga directa desde la unidad;
- descarga desde la respuesta visual de Mentat;
- nombre de archivo legible;
- PDF con texto seleccionable cuando sea posible;
- gráficos y tablas legibles en impresión;
- validación de página, márgenes, logo y saltos de página;
- mensaje claro si no hay datos suficientes para generar el archivo.

---

### 6.6 Mentat, copiloto de clima y datos

Mentat es un copiloto conversacional integrado a la plataforma. Su objetivo es responder preguntas sobre datos disponibles en el sistema, respetando el contexto de navegación y los permisos del usuario.

### Interfaz

- panel de chat accesible desde el sistema;
- avatar e identidad visual propia;
- indicador de contexto actual, por ejemplo Grupo EMARESA, unidad o división;
- historial de la conversación actual;
- mensajes de usuario y Mentat diferenciados;
- sugerencias de preguntas;
- estado de carga y error;
- botón para cerrar y reabrir el panel;
- diseño usable en desktop y móvil.

### Capacidades funcionales objetivo

Mentat debe ser capaz de:

- responder el resultado global;
- responder el resultado de Gestión Corporativa;
- listar las 3 mejores unidades por resultado de clima;
- listar las 3 peores unidades por resultado de clima;
- indicar la cantidad solicitada, sin entregar el ranking completo salvo que el usuario lo pida;
- comparar dos unidades de negocio;
- comparar más de dos unidades si el usuario lo solicita;
- comparar una unidad con el promedio del grupo;
- listar las mejores o peores categorías medidas;
- responder la nota de una pregunta o categoría;
- mostrar datos de un área o subárea cuando exista información asociada;
- explicar la estructura BUK y sus conteos;
- generar tablas comparativas;
- generar gráficos de barras, ranking o variación;
- permitir descargar tablas y gráficos como PDF diseñado;
- reconocer el contexto de la unidad o división abierta;
- declarar cuando la información no está disponible;
- indicar la fuente, período y criterio utilizado.

### Ejemplos de consultas soportadas

Estas preguntas deben formar parte de la demostración y de las pruebas de aceptación:

1. “Dime las 3 unidades de negocio mejor evaluadas por resultado de clima.”
2. “Dime las 3 unidades de negocio peor evaluadas por resultado de clima.”
3. “Compara A&J con Construcción por resultado de clima.”
4. “Compara A&J, Construcción e I&F y muéstralo en una tabla.”
5. “Dime las 3 mejores categorías de clima medidas.”
6. “¿Cuál es la categoría con menor resultado?”
7. “¿Qué nota tiene la pregunta sobre reconocimiento en A&J?”
8. “¿Cuál es la participación de A&J y cómo se compara con el grupo?”
9. “¿Qué áreas y subáreas existen en la estructura de BUK?”
10. “Muéstrame las áreas con más personas.”
11. “Haz un gráfico comparando A&J y Construcción y permite descargarlo en PDF.”
12. “Crea un informe con esta tabla y este gráfico.”

### Reglas conversacionales críticas

- “3 mejores” significa devolver exactamente 3 resultados, salvo que no existan 3 datos válidos.
- “3 peores” significa ordenar de menor a mayor y devolver exactamente 3 resultados.
- “Unidades” debe interpretarse como unidades de negocio, no como áreas BUK.
- “Áreas evaluadas” debe interpretarse como categorías de clima cuando la consulta habla de evaluación o nota.
- Si el usuario menciona dos nombres de unidades, Mentat debe comparar esas dos unidades y no mostrar todo el ranking.
- Una tabla o gráfico debe respetar el filtro y la cantidad solicitada.
- Toda respuesta numérica debe indicar métrica y período.
- Cuando BUK solo entregue estructura y conteos, Mentat no debe inventar resultados de clima para áreas o subáreas.
- Si el pedido es ambiguo, Mentat debe hacer una pregunta de aclaración corta.
- Si no hay datos, debe explicar qué dato falta y sugerir una consulta válida.

### Respuesta visual

Mentat debe poder devolver, según la consulta:

- respuesta breve;
- tarjetas de resultado;
- ranking limitado;
- barras horizontales;
- tabla comparativa;
- variación entre períodos;
- resumen ejecutivo;
- enlace o botón de descarga PDF.

La descarga debe permanecer disponible después de que la respuesta visual aparezca y no depender de que el usuario haga clic en un elemento que desaparece al continuar la conversación.

### Implementado en el demo

Existe un panel Mentat con respuestas para rankings, comparaciones y consultas de datos, además de bloques visuales y descarga de informes PDF vectoriales para respuestas con gráficos o tablas.

### Evolución propuesta

- motor de lenguaje conectado a una capa segura de consulta;
- trazabilidad de fuentes y filtros usados;
- mayor cobertura de áreas, subáreas, períodos y notas;
- control de permisos por usuario;
- consultas guardadas;
- historial exportable;
- feedback de respuesta;
- métricas de uso y calidad;
- conexión con un modelo de IA aprobado por EMARESA, si corresponde.

---

### 6.7 Actualización diaria desde BUK

La base organizacional debe actualizarse una vez al día a las 22:00 horas de Chile.

### Flujo esperado

1. El proceso se inicia automáticamente cada día.
2. Se autentica contra la instancia BUK de EMARESA.
3. Consulta la estructura autorizada.
4. Valida el formato y la respuesta.
5. Genera un snapshot versionado.
6. Publica la nueva información si la validación es exitosa.
7. Registra fecha, duración, resultado y errores.
8. Notifica a los administradores cuando el proceso falle.

### Fuente actual

- instancia BUK: `https://emaresa.buk.cl`;
- API base utilizada por el proceso actual: `https://emaresa.buk.cl/api/v1/chile`;
- autenticación mediante secreto seguro `BUK_API_TOKEN`;
- ejecución programada mediante el pipeline de despliegue.

La propuesta comercial no debe incluir el token ni ningún secreto. El acceso debe gestionarse como variable protegida en el entorno de ejecución.

### Alcance actual de la sincronización

La integración actual considera principalmente:

- compañías;
- áreas;
- subáreas;
- relaciones jerárquicas;
- conteos agregados de personas;
- notas o información agregada disponible en la fuente.

No debe asumirse que BUK entrega resultados de clima por sí mismo. Los resultados de clima y la estructura organizacional deben modelarse como fuentes relacionadas, con reglas explícitas de asociación.

### Requisitos operacionales

- zona horaria `America/Santiago`;
- manejo de horario de verano e invierno;
- ejecución manual disponible para administradores;
- reintento controlado ante errores transitorios;
- no reemplazar un snapshot válido por una respuesta incompleta;
- historial de snapshots;
- alerta de falla;
- indicador visible de última actualización.

---

## 7. Flujos principales

### Flujo A: lectura ejecutiva

1. El usuario ingresa al tablero.
2. Selecciona el período.
3. Revisa KPIs globales.
4. Hace clic en un KPI para abrir el detalle.
5. Selecciona una unidad del ranking.
6. Ingresa al detalle de la unidad.

### Flujo B: drill-down a una unidad

1. El usuario abre una compañía o unidad.
2. Revisa resultado, participación y posición.
3. Explora categorías y preguntas.
4. Abre una división legal.
5. Explora áreas y subáreas disponibles.
6. Genera el informe de clima de la unidad.

### Flujo C: generación de informe oficial

1. El usuario abre una unidad autorizada.
2. Selecciona **Generar informe de clima**.
3. El sistema valida que existan datos suficientes.
4. Previsualiza o genera el PDF.
5. Descarga el informe con el formato oficial EMARESA.

### Flujo D: consulta con Mentat

1. El usuario abre Mentat.
2. Mentat indica el contexto activo.
3. El usuario realiza una consulta.
4. Mentat interpreta el alcance, cantidad, métrica y período.
5. Responde con texto y, si corresponde, tabla o gráfico.
6. El usuario puede descargar un informe analítico en PDF.

### Flujo E: actualización BUK

1. El proceso se ejecuta a las 22:00.
2. Consulta BUK con credenciales protegidas.
3. Valida y guarda el snapshot.
4. Actualiza la estructura visible.
5. Registra el resultado.
6. Informa el estado al administrador.

---

## 8. Requisitos funcionales y criterios de aceptación

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| FR-001 | Ver tablero ejecutivo | El usuario visualiza los KPIs del período seleccionado sin duplicaciones. |
| FR-002 | KPIs interactivos | Al hacer clic en cada KPI se abre su detalle o la vista asociada. |
| FR-003 | Navegación jerárquica | El usuario puede pasar desde grupo a compañía, unidad, división, área y subárea cuando existan datos. |
| FR-004 | Contexto visible | La interfaz muestra siempre el nivel y período actualmente seleccionados. |
| FR-005 | Ranking limitado | Una consulta por “3 mejores” o “3 peores” devuelve exactamente 3 filas válidas. |
| FR-006 | Comparación explícita | Una consulta con nombres concretos compara solo los elementos solicitados. |
| FR-007 | Categorías de clima | El sistema separa categorías evaluadas de áreas estructurales BUK. |
| FR-008 | Estados sin datos | Un nivel sin resultado muestra un estado vacío explicativo y no una cifra inventada. |
| FR-009 | Informe por unidad | Cada unidad autorizada ofrece la acción “Generar informe de clima”. |
| FR-010 | Formato oficial | El PDF de unidad conserva el formato, logo y estructura aprobados por EMARESA. |
| FR-011 | Datos de unidad | El informe de una unidad no reutiliza resultados de otra unidad. |
| FR-012 | Mentat visual | Mentat puede responder con texto, tabla o gráfico según la consulta. |
| FR-013 | Descarga Mentat | Un gráfico o tabla generado por Mentat puede descargarse como PDF diseñado. |
| FR-014 | Persistencia de descarga | El control de descarga permanece disponible hasta que el usuario lo utiliza o genera una nueva salida. |
| FR-015 | Fuente y período | Toda respuesta numérica muestra o permite consultar fuente, métrica y período. |
| FR-016 | Estructura BUK | El usuario puede explorar compañías, áreas y subáreas disponibles. |
| FR-017 | Privacidad | No se muestran datos personales individuales en la experiencia de clima. |
| FR-018 | Actualización diaria | La sincronización BUK se ejecuta a las 22:00 de Chile y deja registro de estado. |
| FR-019 | Error de sincronización | Una respuesta BUK incompleta no reemplaza el último snapshot válido. |
| FR-020 | Responsive | Los flujos principales funcionan en desktop y móvil sin solapamientos ni cortes de contenido. |
| FR-021 | Menús y acciones | Todos los botones, menús, cierres, enlaces y descargas visibles ejecutan la acción anunciada. |
| FR-022 | Accesibilidad básica | Los controles tienen foco visible, nombres comprensibles y contraste suficiente. |

---

## 9. Datos y métricas

### 9.1 Entidades principales

- **Período:** ciclo de medición, por ejemplo S1 2026.
- **Compañía:** entidad legal o compañía del Grupo EMARESA.
- **Unidad de negocio:** unidad utilizada para el ranking y el informe de clima.
- **División legal:** nivel legal o administrativo asociado a la unidad.
- **Área:** nodo de la estructura organizacional.
- **Subárea:** nodo hijo del área.
- **Categoría:** dimensión o tema medido por la encuesta.
- **Pregunta:** ítem de medición asociado a una categoría.
- **Resultado:** valor porcentual o nota de una dimensión para un período y alcance.
- **Participación:** relación entre respuestas y universo enviado, expresada como porcentaje.
- **Snapshot BUK:** fotografía versionada de la estructura y sus conteos agregados.

### 9.2 Métricas

- resultado global;
- resultado de Gestión Corporativa;
- resultado por unidad;
- resultado por división;
- resultado por categoría;
- resultado por pregunta;
- enviados;
- respondidas;
- participación;
- diferencia contra grupo;
- diferencia contra período anterior;
- posición en ranking;
- cantidad de compañías, áreas y subáreas;
- cantidad agregada de personas.

### 9.3 Reglas de calidad

- conservar el período en cada registro;
- evitar mezclar porcentajes y notas sin etiqueta;
- conservar precisión interna y redondeo de presentación;
- validar que participación no supere 100%;
- marcar valores faltantes como no disponibles;
- registrar la fecha de carga y la fuente;
- impedir duplicados al consolidar la misma unidad y período.

### 9.4 Datos de referencia del demo

El demo utiliza información de referencia de S1 2026. Los valores del demo sirven para validar la experiencia y no deben presentarse en la propuesta como un SLA ni como una garantía de resultados futuros.

Entre las dimensiones de ejemplo se encuentran resultado global, Gestión Corporativa, categorías de clima, preguntas y ranking de 15 unidades de negocio. La estructura BUK de ejemplo contempla compañías, áreas, subáreas y conteos agregados. Las cifras deben considerarse dinámicas y sujetas a la fuente oficial y al período seleccionado.

---

## 10. Integraciones y arquitectura de referencia

### 10.1 Aplicación

La versión actual es una aplicación web basada en:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router con navegación compatible con GitHub Pages.

### 10.2 Fuente BUK

La plataforma consume la API de BUK de EMARESA mediante un proceso de sincronización protegido. La integración debe aislarse detrás de una capa de datos para que la interfaz no dependa directamente de secretos ni de detalles de autenticación.

### 10.3 Fuente de clima

Los resultados de clima deben estar disponibles en un formato estructurado que permita filtrar por:

- período;
- compañía;
- unidad;
- división;
- categoría;
- pregunta.

La asociación entre clima y BUK debe documentarse y validarse con EMARESA.

### 10.4 Generación de PDF

Se deben distinguir dos motores o plantillas:

1. **Informe oficial:** formato definido por EMARESA y parametrizado por unidad.
2. **Informe analítico:** salida dinámica de Mentat con gráficos, tablas y resumen ejecutivo.

### 10.5 Despliegue

El demo actual se publica en GitHub Pages. Para producción, la propuesta debe cotizar o definir:

- hosting;
- dominio o subdominio;
- certificados;
- ambientes de desarrollo, prueba y producción;
- mecanismo de autenticación;
- almacenamiento de snapshots e informes;
- monitoreo y respaldos.

---

## 11. Seguridad, privacidad y gobierno de datos

### Requisitos mínimos

- no exponer tokens en el frontend;
- almacenar secretos únicamente en el entorno seguro de ejecución;
- no publicar RUT, nombres, correos ni datos personales;
- mostrar información agregada;
- aplicar umbral mínimo de respuestas para evitar identificación indirecta, si EMARESA lo exige;
- definir roles y permisos;
- registrar generación y descarga de informes;
- separar datos de demo de datos productivos;
- mantener trazabilidad de fuente, período y fecha de actualización;
- definir retención y eliminación de snapshots históricos.

### Preguntas a resolver con EMARESA

- ¿Qué perfiles tendrán acceso?
- ¿Se requiere inicio de sesión corporativo o SSO?
- ¿Qué umbral mínimo de respuestas se debe aplicar?
- ¿Por cuánto tiempo se conservarán los períodos históricos?
- ¿Qué usuarios pueden descargar informes?
- ¿Se requiere auditoría de consultas realizadas a Mentat?

---

## 12. Requisitos no funcionales y UX

### Experiencia

- diseño premium, minimalista y elegante;
- jerarquía visual sobria;
- lectura rápida para gerencia;
- navegación predecible;
- sin tarjetas repetidas ni información redundante;
- estados de carga, vacío y error bien definidos;
- acciones visibles y consistentes;
- controles de descarga fáciles de encontrar;
- lenguaje claro en español.

### Rendimiento

- carga inicial rápida;
- consultas de detalle sin recargar innecesariamente toda la aplicación;
- paginación o virtualización para estructuras grandes;
- generación de PDF con tiempos razonables;
- manejo de fallos de red sin pérdida del contexto.

### Responsive

- soportar desktop, tablet y móvil;
- evitar solapamiento de textos, tablas y controles;
- mantener acciones principales accesibles en pantallas pequeñas;
- adaptar tablas a scroll o vista apilada sin perder información.

### Accesibilidad

- navegación por teclado;
- estados de foco;
- contraste adecuado;
- etiquetas para iconos y botones;
- uso correcto de títulos y regiones;
- no depender exclusivamente del color para comunicar el resultado.

---

## 13. Entregables para la propuesta comercial

La propuesta debería incluir, como mínimo, los siguientes entregables:

1. Aplicación web EMARESA Clima.
2. Tablero ejecutivo con KPIs interactivos.
3. Navegación jerárquica con drill-down.
4. Vista de estructura organizacional BUK.
5. Vistas de unidad y división legal.
6. Visualización de categorías y preguntas.
7. Generación de informe oficial por unidad.
8. Generación de informes analíticos desde Mentat.
9. Mentat con consultas de rankings, comparaciones, tablas y gráficos.
10. Descarga PDF de tablas y gráficos.
11. Sincronización diaria con BUK a las 22:00 de Chile.
12. Configuración de ambientes y despliegue.
13. Documentación funcional y técnica.
14. Manual breve para usuarios.
15. Capacitación para administradores y usuarios clave.
16. Pruebas de aceptación.
17. Soporte de estabilización posterior a la puesta en marcha.

### Entregables opcionales

- SSO corporativo;
- panel de administración;
- histórico de períodos;
- alertas por correo;
- informes programados;
- envío automático de informes;
- permisos por compañía o unidad;
- auditoría de consultas Mentat;
- integración con otras fuentes;
- versión multiempresa o multiidioma;
- tablero de seguimiento de planes de acción;
- exportación a Excel o PowerPoint;
- API para consumo externo.

---

## 14. Propuesta de fases de implementación

### Fase 1: base funcional y experiencia ejecutiva

**Objetivo:** disponer de una plataforma navegable para consultar resultados y estructura.

**Incluye:**

- tablero ejecutivo;
- KPIs interactivos;
- drill-down grupo, compañía y unidad;
- resultados de clima del período acordado;
- categorías y preguntas disponibles;
- estructura BUK;
- diseño visual premium;
- responsive;
- validación con usuarios clave.

### Fase 2: informes e integración operacional

**Objetivo:** convertir la plataforma en una herramienta de distribución y operación.

**Incluye:**

- plantilla oficial de informe EMARESA;
- informe parametrizado por unidad;
- descarga y control de archivos;
- sincronización diaria BUK a las 22:00;
- bitácora y alertas de sincronización;
- ambientes y despliegue productivo;
- permisos iniciales.

### Fase 3: Mentat y analítica conversacional

**Objetivo:** permitir que los usuarios consulten el sistema con lenguaje natural.

**Incluye:**

- interfaz de chat Mentat;
- rankings limitados;
- comparativas explícitas;
- tablas y gráficos;
- descarga de PDF analítico;
- fuentes, período y contexto;
- control de respuestas sin datos;
- pruebas con preguntas reales de EMARESA.

### Fase 4: evolución y gobierno

**Objetivo:** consolidar la solución como plataforma de gestión continua.

**Incluye:**

- histórico de períodos;
- comparaciones interanuales;
- permisos avanzados;
- SSO;
- auditoría;
- métricas de uso;
- informes programados;
- alertas y seguimiento de planes de acción;
- soporte evolutivo.

Los nombres, plazos y precios de las fases deben quedar como campos editables en la propuesta comercial.

---

## 15. Supuestos y fuera de alcance

### Supuestos

- EMARESA entregará acceso autorizado a BUK y documentación de la API disponible.
- EMARESA validará el formato oficial de los informes.
- EMARESA entregará los datos de clima estructurados o definirá el mecanismo de carga.
- Existirá un responsable funcional para validar métricas y resultados.
- Los resultados se mostrarán de forma agregada.
- Los nombres de compañías, unidades, categorías y preguntas serán validados por EMARESA.
- La frecuencia objetivo de actualización BUK será diaria a las 22:00 de Chile.

### Fuera de alcance inicial, salvo contratación expresa

- modificación de datos dentro de BUK;
- captura o edición de respuestas de encuestas;
- publicación de datos personales;
- decisiones automatizadas sobre personas;
- interpretación psicológica individual;
- reemplazo de la metodología de medición de clima;
- generación de conclusiones que no estén respaldadas por datos;
- integraciones no documentadas con otros sistemas;
- envío automático de correos masivos;
- aplicación móvil nativa;
- funcionalidades de planes de acción, salvo que se incorporen como fase.

---

## 16. Riesgos y dependencias

| Riesgo o dependencia | Impacto | Mitigación propuesta |
|---|---|---|
| API BUK limitada o cambiante | La estructura o actualización puede fallar | Validar endpoints, límites, autenticación y contrato de datos. |
| Asociación entre BUK y clima incompleta | El drill-down puede no tener resultados en todos los niveles | Definir llave de relación y estados sin datos. |
| Formato oficial no parametrizado | Los informes por unidad pueden requerir trabajo manual | Aprobar plantilla y campos antes de construir. |
| Datos de demo distintos a producción | Resultados de la presentación pueden no coincidir | Separar claramente demo, prueba y producción. |
| Falta de histórico | No se pueden hacer comparaciones temporales | Definir retención y carga de períodos anteriores. |
| Falta de autenticación | Riesgo de exposición de información interna | Implementar control de acceso antes de producción. |
| Preguntas ambiguas a Mentat | Respuestas incorrectas o demasiado amplias | Aplicar reglas de intención, cantidad, métrica y contexto. |
| Datos insuficientes en áreas o subáreas | El usuario puede esperar una nota inexistente | Mostrar fuente y estado explícito de disponibilidad. |
| Generación de PDF variable | Informes ilegibles o inconsistentes | Pruebas de impresión y aprobación visual por plantilla. |
| Cambio horario en Chile | La ejecución puede ocurrir a otra hora | Configurar `America/Santiago` y validar horario local. |

---

## 17. Guion de demostración y aceptación

Para una presentación comercial se recomienda mostrar el siguiente recorrido:

1. Abrir el tablero ejecutivo.
2. Mostrar resultado global, participación y Gestión Corporativa.
3. Hacer clic en un KPI y abrir su detalle.
4. Entrar al ranking de unidades.
5. Abrir A&J y mostrar sus indicadores.
6. Abrir una división legal.
7. Volver a la unidad y seleccionar **Generar informe de clima**.
8. Abrir Mentat.
9. Preguntar: “Dime las 3 unidades de negocio mejor evaluadas por resultado de clima”.
10. Verificar que responda exactamente 3 unidades.
11. Preguntar: “Dime las 3 unidades de negocio peor evaluadas por resultado de clima”.
12. Preguntar: “Compara A&J con Construcción por resultado de clima”.
13. Solicitar una tabla y luego un gráfico.
14. Descargar el PDF analítico.
15. Mostrar la estructura BUK y la fecha de actualización.
16. Explicar la diferencia entre informe oficial de unidad e informe analítico de Mentat.

### Criterios de aprobación de la demo

- ningún menú visible queda sin acción;
- todos los KPIs principales son interactivos;
- el drill-down conserva el contexto;
- “3 mejores” y “3 peores” devuelven tres resultados;
- las comparaciones muestran solo las unidades solicitadas;
- Mentat no inventa notas para áreas sin medición;
- la descarga PDF funciona desde la respuesta visual;
- el informe de unidad utiliza los datos de la unidad seleccionada;
- la interfaz no presenta información repetida de forma innecesaria;
- la experiencia funciona en el tamaño de pantalla utilizado para la presentación.

---

## 18. Información que debe completar la propuesta comercial

Claude debe dejar estos campos editables o explicitarlos como decisiones pendientes:

- cliente y razón social;
- alcance contratado;
- número de compañías y unidades incluidas;
- períodos históricos a cargar;
- fuente definitiva de resultados de clima;
- alcance de la integración BUK;
- tipo de autenticación;
- hosting y dominio;
- ambientes incluidos;
- plazo de implementación;
- calendario de hitos;
- horas de capacitación;
- período de garantía o estabilización;
- modalidad y horario de soporte;
- SLA;
- precio de implementación;
- costo mensual o anual de operación;
- costo de Mentat o consumo de IA, si aplica;
- costo de fases opcionales;
- condiciones de pago;
- vigencia de la oferta;
- exclusiones comerciales.

No inventar precios, fechas, niveles de servicio ni compromisos de volumen. Utilizar marcadores como `[Completar con propuesta comercial]` hasta que EMARESA los confirme.

---

## 19. Referencias del producto actual

### Aplicación y despliegue

- repositorio: `https://github.com/ispipipi/emaresa-clima-demo`;
- demo publicado: `https://ispipipi.github.io/emaresa-clima-demo/`;
- base path actual: `/emaresa-clima-demo/`.

### Rutas principales del demo

- `/`: inicio y tablero ejecutivo;
- `/gestion-corporativa`: resultados de Gestión Corporativa;
- `/organizacion`: estructura organizacional BUK;
- `/manual`: manual de uso;
- `/unidad/:nombre`: detalle de unidad;
- `/unidad/:nombre/division/:division`: detalle de división legal.

### Archivos y activos de referencia

- `public/reportes/gestion-corporativa-s1-2026.pdf`;
- `public/reportes/aj-s1-2026.pdf`;
- `public/reportes/portadas/`;
- `src/data/clima.json`;
- `src/data/corporativo.ts`;
- `src/data/generated/buk-organization.json`;
- `src/components/MentatCopilot.tsx`;
- `src/lib/mentat.ts`;
- `src/lib/mentatPdf.ts`;
- `.github/workflows/deploy.yml`.

### Fuentes de diseño y documentación

El repositorio contiene handoffs de diseño, documentación funcional histórica, datos de referencia y los informes PDF entregados por EMARESA. Claude debe considerar esos archivos como material de apoyo y mantener como autoridad principal el formato oficial de los informes que EMARESA aprobó.

---

## 20. Instrucciones para elaborar la propuesta comercial

Preparar una propuesta comercial en español, ejecutiva y visualmente clara, que incluya:

1. contexto y problema;
2. propuesta de valor;
3. solución y módulos;
4. flujo de usuario;
5. integración con BUK;
6. Mentat y sus capacidades;
7. informes oficiales y analíticos;
8. seguridad y privacidad;
9. fases y entregables;
10. cronograma editable;
11. supuestos y exclusiones;
12. soporte y operación;
13. inversión editable;
14. criterios de éxito;
15. próximos pasos.

La redacción debe ser comercial, pero técnicamente honesta. No presentar el demo como un producto productivo terminado si una capacidad depende de configuración, datos de EMARESA, autenticación o validación de la plantilla oficial.

La propuesta debe enfatizar tres ideas:

- **Entender el clima de un vistazo.**
- **Bajar desde el grupo hasta la unidad que necesita atención.**
- **Convertir preguntas de gestión en análisis e informes accionables.**

---

## 21. Decisiones pendientes para cerrar alcance

1. ¿Cuál es la fuente definitiva de los resultados de clima en producción?
2. ¿Qué compañías y unidades deben incluirse en la primera versión?
3. ¿Qué niveles de la estructura BUK deben tener resultado de clima y cuáles solo estructura?
4. ¿Qué plantilla exacta será el informe oficial por unidad?
5. ¿Se requieren informes históricos y comparaciones entre períodos?
6. ¿Qué perfiles y permisos se necesitan?
7. ¿Se requiere SSO corporativo?
8. ¿Qué modelo de IA podrá utilizar Mentat en producción?
9. ¿Qué restricciones de privacidad o umbral mínimo aplican?
10. ¿Quién aprueba los resultados y textos de los informes?
11. ¿Dónde se alojará la versión productiva?
12. ¿Qué soporte y disponibilidad se comprometerán?

---

## 22. Resumen para la propuesta

EMARESA Clima es una plataforma web de clima organizacional con visión ejecutiva, navegación jerárquica, conexión con la estructura BUK, informes PDF e inteligencia conversacional. Su valor está en unir la lectura global con el detalle operativo: la dirección puede detectar brechas, las unidades pueden entender sus resultados y Mentat puede convertir preguntas en comparaciones, gráficos, tablas e informes descargables.

La propuesta debe cotizar una primera versión funcional y una evolución progresiva hacia una plataforma productiva, segura, histórica y administrable.
