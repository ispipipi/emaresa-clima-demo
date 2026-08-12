# Handoff para Claude Design

## Grupo Emaresa - Dashboard de Clima Organizacional

**Fecha:** 2026-08-12  
**Repositorio:** `https://github.com/ispipipi/emaresa-clima-demo`  
**Demo publicada:** `https://ispipipi.github.io/emaresa-clima-demo/`  
**Commit entregado:** `aba127e` - `Redesign climate dashboard experience`  
**Estado:** demo funcional publicada, lista para una nueva pasada de diseño y refinamiento visual.

## 1. Objetivo del handoff

Este documento entrega a Claude Design el contexto completo para continuar el diseño de la experiencia de Clima Organizacional de Grupo Emaresa sin perder:

- Los datos y números ya validados.
- Los informes PDF originales que se deben enviar.
- La navegación jerárquica desde Grupo Emaresa hasta la división legal.
- La integración de snapshot organizacional con BUK.
- Las interacciones que ya deben mantenerse operativas.
- El lenguaje visual premium solicitado por el cliente.

La aplicación no es una landing page ni una maqueta estática. Es una herramienta interna de consulta y envío de informes. La prioridad es que una persona pueda leer, comparar, abrir el detalle y descargar el informe correcto con el menor esfuerzo posible.

## 2. Contexto del producto

El dashboard reemplaza el cálculo manual y el armado de informes de Clima Organizacional. La fuente de resultados de encuesta corresponde al Semestre 1 de 2026.

El usuario debe poder:

1. Ver el resultado consolidado del Grupo Emaresa.
2. Entender rápidamente participación, resultado global y Gestión Corporativa.
3. Abrir una unidad de negocio.
4. Bajar hasta una división legal.
5. Explorar la estructura organizacional de BUK hasta áreas y subáreas.
6. Descargar los PDF originales preparados para envío.

### Tipo de producto

- Dashboard operativo / reporte ejecutivo.
- Solo lectura.
- Sin autenticación en esta demo.
- Sin edición ni carga de datos desde la interfaz.
- No inventar planes de acción ni datos individuales.

## 3. Referencia visual

La referencia solicitada por el cliente es:

`https://ispipipi.github.io/fis-intervent-demo/`

La referencia visual debe interpretarse así:

- Lienzo amplio en azul muy claro.
- Panel de navegación profundo en navy.
- Superficies blancas sobrias, con borde fino y sombra mínima.
- Jerarquía tipográfica fuerte, pero limpia.
- Acciones compactas y claras.
- Sensación premium, editorial y operativa.
- Mucho espacio en blanco.
- Pocos elementos decorativos.
- La información importante debe aparecer antes que los adornos.

### Dirección visual actual aprobada como base

La versión publicada ya usa estos tokens:

| Token | Valor | Uso |
|---|---|---|
| `emaresa.bg` | `#EEF5FC` | Fondo general |
| `emaresa.card` | `#FFFFFF` | Superficies y modales |
| `emaresa.text` | `#17263C` | Texto principal |
| `emaresa.muted` | `#647792` | Texto secundario |
| `emaresa.line` | `#D8E5F2` | Bordes y separadores |
| `emaresa.blue` | `#0B7180` | Acento, links y acciones |
| `emaresa.navy` | `#1F3656` | Sidebar y acciones principales |
| `emaresa.navyDeep` | `#172D4B` | Reserva para contraste profundo |
| `emaresa.gold` | `#E7B64A` | Indicador principal y acento cálido |
| verde | `#16A34A` | Estado favorable |
| amarillo | `#CA8A04` | Estado de atención |
| rojo | `#DC2626` | Estado crítico |

Tipografías:

- `Hanken Grotesk` para títulos y números destacados.
- `Inter` para texto funcional, tablas y navegación.

### Referencias visuales incluidas

En `handoff/assets/` se incluyen:

- `fis-intervent-reference.png`: captura de la referencia visual solicitada.
- `emaresa-home.png`: captura del resumen ejecutivo actual.
- `emaresa-unit.png`: captura del drill-down de una unidad A&J.
- `emaresa-organization.png`: captura del árbol organizacional BUK.

Estas capturas muestran el estado actual; no son una especificación rígida de layout. Pueden utilizarse como punto de partida para una iteración visual más refinada.

## 4. Arquitectura de navegación

La aplicación utiliza React Router con `HashRouter`, porque se publica en GitHub Pages.

| Ruta | Pantalla | Propósito |
|---|---|---|
| `/#/` | Resumen ejecutivo | Resultado consolidado del grupo, informes, KPI, categorías, preguntas y unidades |
| `/#/gestion-corporativa` | Gestión Corporativa | Resultado corporativo, meses, equipos, preguntas e informe original |
| `/#/organizacion` | Organización BUK | Empresas, áreas, subáreas y conteos agregados |
| `/#/unidad/:nombre` | Unidad de negocio | KPI, categorías, divisiones legales y preguntas |
| `/#/unidad/:nombre/division/:division` | División legal | Resultado del nivel más pequeño disponible |

Ejemplos:

- `/#/unidad/A%26J`
- `/#/unidad/A%26J/division/EMARESA%20S.A.`

### Jerarquía funcional

```text
Grupo Emaresa
├── Resumen ejecutivo
├── Gestión Corporativa
├── Organización BUK
└── Unidades de negocio
    └── Unidad de negocio
        └── División legal
```

## 5. Interacciones obligatorias

Todas las interacciones existentes deben mantenerse al rediseñar.

### Navegación

- El menú lateral funciona en desktop.
- En móvil se abre como drawer y tiene backdrop y cierre.
- El ítem activo debe ser visible.
- Las unidades activas muestran sus divisiones legales.
- Cada link debe navegar a una ruta real.
- El cambio de ruta debe llevar el scroll a `top: 0`.

### KPI

Todos los KPI son clickeables.

Al hacer click deben:

- Abrir un modal de detalle.
- Mostrar el nombre del indicador.
- Mostrar el valor y estado.
- Mostrar una explicación breve.
- Mostrar filas de composición cuando existan.
- Permitir cerrar por botón, click fuera y botón de cierre.

No convertir los KPI en elementos decorativos sin acción.

### Informes

Los botones de descarga deben descargar los archivos originales, sin generar PDF nuevo:

- `public/reportes/gestion-corporativa-s1-2026.pdf`
- `public/reportes/aj-s1-2026.pdf`

Las portadas corresponden a:

- `public/reportes/portadas/gestion-corporativa-s1-2026.png`
- `public/reportes/portadas/aj-s1-2026.png`

### Organización BUK

- Los KPI de cobertura deben llevar al árbol organizacional.
- El árbol usa `details` y `summary` para expandir y contraer nodos.
- Empresa, área y subárea deben permanecer legibles.
- Mostrar solo conteos agregados.
- No publicar nombres de personas, RUT, correos ni datos contractuales.

### Tablas y listas

- Las filas de unidades abren el detalle correspondiente.
- Las divisiones legales abren su nivel de detalle.
- En móvil, tablas amplias deben usar scroll horizontal contenido.
- Los textos largos nunca deben provocar overflow de toda la página.

## 6. Datos y reglas de negocio

### Dataset de clima

Fuente principal:

`src/data/clima.json`

Tipos TypeScript:

`src/types/clima.ts`

El dataset contiene:

- `global`.
- `unidades[]`.
- Resultado global.
- Resultado de Gestión Corporativa.
- Participación.
- Categorías.
- Preguntas top y bottom.
- Ranking de unidades.
- Divisiones legales.

No modificar silenciosamente números del JSON en una iteración visual.

### Reglas de estado

| Resultado | Estado |
|---|---|
| `>= 80` | Favorable / verde |
| `>= 60` y `< 80` | Atención / amarillo |
| `< 60` | Crítico / rojo |

La lógica está centralizada en:

`src/lib/format.ts`

### Gestión Corporativa

Gestión Corporativa se muestra separada del resultado global de clima. No mezclarla con las categorías del resultado global.

Fuente:

`src/data/corporativo.ts`

### Snapshot BUK

Fuente publicada:

`src/data/buk-organization.json`

Tipos:

`src/types/buk.ts`

El snapshot actual contiene, como referencia del build publicado:

- 7 empresas.
- 261 áreas y subáreas.
- 735 personas activas contabilizadas.

El script de sincronización es:

`scripts/sync-buk.mjs`

La API base de build es:

`https://emaresa.buk.cl/api/v1/chile`

La credencial se consume únicamente como secreto de GitHub Actions `BUK_API_TOKEN`. Nunca incluir el token en archivos, prompts, capturas o commits.

El script publica únicamente agregados y no expone fichas personales.

## 7. Mapa de archivos relevantes

### Entrada y rutas

- `src/App.tsx`: definición de rutas.
- `src/main.tsx`: bootstrap de React.
- `src/components/ScrollToTop.tsx`: reset de scroll por ruta.

### Layout y navegación

- `src/components/AppShell.tsx`: shell general, sidebar, header y drawer móvil.
- `src/components/HierarchyNav.tsx`: navegación jerárquica.

### Componentes funcionales

- `src/components/KpiCard.tsx`: KPI interactivo y modal.
- `src/components/ReportCard.tsx`: informe original y descarga.
- `src/components/CategoryBars.tsx`: barras por categoría.
- `src/components/QuestionList.tsx`: preguntas top/bottom.
- `src/components/StatusPill.tsx`: semáforo.
- `src/components/OrganizationTree.tsx`: árbol BUK.

### Pantallas

- `src/pages/HomePage.tsx`: resumen ejecutivo.
- `src/pages/CorporatePage.tsx`: Gestión Corporativa.
- `src/pages/OrganizationPage.tsx`: organización BUK.
- `src/pages/UnitDetailPage.tsx`: unidad de negocio.
- `src/pages/DivisionDetailPage.tsx`: división legal.

### Datos, formatos e informes

- `src/data/clima.json`: dataset de clima.
- `src/data/corporativo.ts`: detalle corporativo.
- `src/data/buk-organization.json`: snapshot BUK.
- `src/lib/clima.ts`: helpers de búsqueda y rutas.
- `src/lib/buk.ts`: lectura y formato del snapshot BUK.
- `src/lib/format.ts`: porcentajes, estados y formatos.
- `src/lib/reports.ts`: definición y URLs de informes.

### Estilos y configuración

- `src/index.css`: base global y focus states.
- `tailwind.config.js`: tokens y tipografías.
- `index.html`: fuentes Google Fonts y metadata.
- `vite.config.ts`: base de GitHub Pages.
- `package.json`: scripts y dependencias.
- `.github/workflows/deploy.yml`: sync BUK, build y deploy.

## 8. Archivos de referencia entregados

Dentro de `handoff/source-docs/` se incluyen copias de:

- `EMARESA_HANDOFF-CLAUDE-CODEX_v1.1.md`: handoff histórico de construcción.
- `EMARESA_MD-FUNCIONAL-CLIMA_v1.1.md`: documento funcional congelado.

Dentro de `handoff/source-data/` se incluye:

- `emaresa-clima-dataset.json`: dataset original entregado para la construcción.

El documento funcional histórico describe la primera versión Type D sin BUK. La realidad actual de la demo es la descrita en este handoff: existe sincronización de snapshot BUK durante el build, además de las vistas de Gestión Corporativa y división legal.

## 9. Qué debe hacer Claude Design

### Objetivo de diseño

Refinar la experiencia para que se sienta más elegante, minimalista y premium, manteniendo su utilidad operativa.

### Prioridades

1. Mejorar jerarquía visual y lectura rápida.
2. Hacer más evidente qué elementos son accionables.
3. Mantener los PDF y el drill-down como tareas de primer nivel.
4. Refinar responsive en móvil sin overflow.
5. Reducir ruido visual, sombras y elementos decorativos.
6. Mantener la personalidad de la referencia FIS Intervent sin copiarla literalmente.

### Restricciones

- No convertir la aplicación en una landing page.
- No reemplazar los PDF originales.
- No eliminar los KPI interactivos.
- No eliminar las rutas existentes.
- No mezclar Gestión Corporativa con clima global.
- No cambiar las reglas 80/60.
- No publicar datos personales de BUK.
- No agregar dependencias sin necesidad.
- No crear una nueva paleta morada, beige o basada en gradientes.
- No utilizar tarjetas anidadas ni paneles decorativos innecesarios.

### Preguntas de diseño que sí pueden resolverse

- Si el dashboard necesita un header más compacto.
- Si los informes deben ocupar más presencia en el primer viewport.
- Cómo representar mejor la progresión de niveles.
- Si las tablas deben pasar a filas compactas en móvil.
- Cómo hacer más visible la acción "Ver detalle" de los KPI.
- Si el árbol BUK requiere una affordance de expansión más clara.

## 10. Criterios de aceptación de la próxima iteración

### Visual

- El primer viewport comunica de inmediato que es un reporte de clima de Grupo Emaresa.
- La interfaz se siente premium, sobria y funcional.
- El contenido principal domina visualmente sobre la navegación.
- La navegación lateral se siente estable y no compite con los datos.
- Los informes descargables son fáciles de encontrar.
- Los valores, estados y jerarquías tienen contraste suficiente.

### Funcional

- Todas las rutas descritas en la sección 4 cargan.
- Todos los KPI abren su detalle.
- Todos los botones tienen una acción real.
- Los PDF descargan correctamente.
- El menú móvil abre y cierra correctamente.
- El árbol BUK expande y contrae niveles.
- Las filas de unidades y divisiones navegan correctamente.
- El scroll se reinicia al cambiar de ruta.

### Datos

- No se cambian números del dataset.
- Los estados respetan 80/60.
- Gestión Corporativa permanece separada.
- BUK continúa mostrando solo agregados.

### Responsive

- Desktop revisado a 1440 px.
- Mobile revisado a 390 px.
- Sin overflow horizontal global.
- Textos largos de razones sociales y preguntas se adaptan.
- Las tablas usan scroll interno cuando corresponde.

## 11. Comandos de verificación

Desde la raíz del proyecto:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Para sincronizar el snapshot BUK localmente, requiere una credencial configurada en el entorno:

```bash
BUK_API_TOKEN=... npm run sync:buk
```

No guardar ese valor en el repositorio.

## 12. Estado técnico y riesgos

### Verificado

- `npm run lint` pasa.
- `npm run build` pasa.
- GitHub Actions ejecutó correctamente sync BUK, build y deploy.
- GitHub Pages responde en la URL pública.
- Ambos PDF publicados responden correctamente.
- El commit actual está en `main` y en el branch `codex/premium-clima-dashboard`.

### Riesgos pendientes

- El workflow muestra una advertencia de obsolescencia relacionada con Node.js 20 en algunas actions. No bloquea el deploy actual, pero debe actualizarse en una pasada de mantenimiento.
- El token BUK fue compartido durante el trabajo previo. Debe rotarse y actualizarse en GitHub Secrets.
- La demo sigue siendo pública y sin autenticación. No incorporar datos personales si se mantiene este modelo de hosting.
- El snapshot BUK es agregado y se actualiza en build; no es una conexión interactiva desde el navegador.

## 13. Entrega para Claude Design

Abrir primero:

1. `handoff/CLAUDE_DESIGN_HANDOFF.md`
2. `handoff/FILE_MANIFEST.md`
3. `handoff/assets/fis-intervent-reference.png`
4. `handoff/assets/emaresa-home.png`
5. `handoff/assets/emaresa-unit.png`
6. `handoff/assets/emaresa-organization.png`

Después revisar:

- `src/components/AppShell.tsx`
- `src/components/KpiCard.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/UnitDetailPage.tsx`
- `src/pages/OrganizationPage.tsx`
- `public/reportes/`

La instrucción final para la iteración de diseño es:

> Refinar la interfaz existente hacia una experiencia minimalista, elegante y premium inspirada en FIS Intervent. Mantener el dashboard como herramienta operativa: los KPI deben ser accionables, los PDF deben descargarse sin transformación y el usuario debe poder bajar desde Grupo Emaresa hasta la división legal y desde la empresa BUK hasta sus subáreas. No cambiar los datos ni las reglas de negocio. Entregar diseño y código implementable, con desktop y mobile verificados.

