# Rediseño Clima Emaresa · notas de implementación

Verificación realizada: todos los archivos nuevos se revisaron con el compilador de TypeScript 5.9 usando las opciones de `tsconfig.app.json` y los archivos reales del repositorio (Mentat, `lib`, `types`, `data`). Resultado: sin errores. No se ejecutó `npm run build` ni la aplicación en un navegador: hazlo antes de publicar.

## Cómo aplicarlo

1. Copia el contenido de `implementation/` sobre la raíz del repositorio (mismas rutas que en el repo).
2. `npm install` (no hay dependencias nuevas) y luego `npm run dev` y `npm run build`.
3. Opcional: borra los archivos que ya no se usan: `src/components/Card.tsx`, `SectionHeader.tsx`, `StatusPill.tsx`, `SegmentedGauge.tsx`.

No se tocó ningún archivo protegido: `clima.json`, `corporativo.ts`, `response-distribution.json`, `action-plans.json`, `buk-organization.json`, `buk.ts`, `sync-buk.mjs` ni los PDF. No hay referencias a `BUK_API_TOKEN`.

## Arquitectura de navegación

- `AppShell` es ahora un layout de ruta (`<Outlet />`): sidebar, Mentat y su conversación sobreviven al cambiar de página. Antes cada página montaba su propio AppShell y reiniciaba a Mentat.
- Breadcrumb Grupo → Unidad → División, cada nivel clickeable y con el color de estado del nivel.
- Home como mapa de unidades (treemap por personas invitadas, color por estado) con panel de la unidad seleccionada, informe PDF y las 3 unidades de menor resultado marcadas como prioridad.
- Mismo orden en los tres niveles: cabecera con estado, KPI, comparación, categorías y preguntas, hijos.
- Buscador global Ctrl/⌘ K (vistas, unidades, divisiones y Mentat).
- Sidebar colapsable (se recuerda en `localStorage`); en móvil es un drawer con fondo atenuado, y los chips de hermanas se desplazan solo dentro de su contenedor.
- El `ScrollToTop` por ruta se mantiene.

## Archivos

Nuevos: `src/lib/hooks.ts`, `src/lib/insights.ts`, `src/components/{ui,Drawer,PageHeader,CommandPalette,StripPlot,UnitMap,HeatmapTable,DivisionCompare}.tsx`, `docs/design/TOKENS.md`.

Reescritos: `tailwind.config.js`, `index.html` (fuentes), `src/index.css`, `src/App.tsx`, `src/lib/format.ts` (mismas exportaciones más `formatSigned` y `tileBackground`), `src/components/{AppShell,HierarchyNav,SiblingStrip,KpiCard,CategoryBars,QuestionList,ActionPlanSuggestions,MonthlyTeams,OrganizationTree,IconSprite}.tsx`, las seis páginas y `src/features/mentat/MentatCopilot.tsx` (misma lógica y mismo motor; solo cambia la interfaz).

## Estados definidos

Cargando: `Skeleton` y la hoja de Mentat con indicador de escritura. Vacío: `EmptyState` (división sin categorías, división única, empresa sin áreas). Error: `ErrorState` (unidad o división no encontrada) y error al preparar el informe de Mentat con reintento. Sin datos: neutrales y detractores fuera de A&J, división con resultado "-".

## Decisiones y datos a confirmar

- Se eliminaron las sparklines con series inventadas (`[72, 75, 77…]`); solo se muestran series reales. Las variaciones ▲▼ son contra el Grupo, la unidad o Favorable.
- El KPI de áreas dice 261 (snapshot) y el árbol muestra 201 con personas activas; la interfaz muestra ambas cifras. Falta confirmar con la fuente cuál es la correcta.
- La división no trae categorías ni preguntas: estado vacío explícito con acceso a la unidad.
- "Requiere atención" = las 3 unidades de menor resultado (`priorityUnits(3)` en `insights.ts`).
- Capturas del Manual: las de `public/manual/` muestran la interfaz anterior; hay que regenerarlas. Si una imagen falta, se muestra un marcador rayado.
- Textos del Manual sin cambios que quedan desactualizados: "aro segmentado" (paso 1), "Generar informe de clima" (pasos 5 y 7) y "controles + y −" (paso 8).
- El período es una etiqueta fija (hay un solo período): no es un botón.

## Checklist de funcionalidades preservadas

- [x] Drilldown Grupo → Unidad → División y tabla de divisiones con acceso
- [x] HashRouter y rutas actuales (incluida la ruta comodín)
- [x] Árbol BUK expandible, con los mismos datos
- [x] Clima global separado de Gestión Corporativa
- [x] Cada KPI abre su panel de detalle
- [x] Descarga de PDF por unidad (incluidos los dos informes de Construcción) y del informe corporativo
- [x] Informes en `public/reportes/`
- [x] Mentat: abrir, responder con tablas y gráficos, descargar PDF, cerrar con Esc
- [x] Planes de acción asociados a las 5 preguntas más bajas
- [x] Menú móvil con drawer, fondo y cierre
- [x] Reinicio de scroll al cambiar de ruta
- [x] Umbrales 80/60

## Revisión pendiente en navegador

Desktop 1440 px, tablet 768 px y móvil 390 px: sin desbordamiento horizontal global, tablas con scroll solo en su contenedor, foco visible, contraste AA, `prefers-reduced-motion`. Referencia visual de cada pantalla: `Emaresa Clima - Direcciones visuales.dc.html`.
