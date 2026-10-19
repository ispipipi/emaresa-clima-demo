# Brief para Claude Design

## Rediseño completo · Dashboard de Clima Grupo Emaresa

**Versión:** 2.0  
**Fecha:** 19 de octubre de 2026  
**Repositorio:** https://github.com/ispipipi/emaresa-clima-demo  
**Demo actual:** https://ispipipi.github.io/emaresa-clima-demo/  
**Referencia visual principal:** https://now-vendedores.web.app/

## 1. Encargo

Rediseñar completamente la interfaz de la aplicación de Clima Organizacional de Grupo Emaresa tomando como referencia visual y de experiencia a NOW Vendedores.

El objetivo es trasladar su lenguaje de producto operativo:

- navegación lateral compacta y estable;
- cabecera de período, sincronización y contexto;
- filtros simples y visibles;
- KPI compactos y accionables;
- tarjetas de análisis con bordes, sombras mínimas y acentos por indicador;
- tablas densas, legibles y navegables;
- responsive real para escritorio, tablet y móvil.

No se debe copiar la marca, los datos, los nombres, los RUT, los textos ni los activos de NOW Vendedores. Se debe tomar únicamente su sistema de layout, ritmo visual, densidad, jerarquía, comportamiento y patrones de interacción.

## 2. Regla principal

La aplicación ya es funcional. El rediseño debe trabajar sobre la aplicación existente y conservar su comportamiento. No crear una landing page, una maqueta estática ni una pantalla desconectada del código.

Antes de diseñar, revisar el proyecto y entender sus rutas, datos y componentes.

## 3. Funcionalidad que debe conservarse

No eliminar ni reemplazar:

- el drilldown Grupo Emaresa → unidad de negocio → división legal;
- la navegación por `HashRouter` para GitHub Pages;
- el árbol organizacional sincronizado desde BUK;
- la separación entre clima global y Gestión Corporativa;
- los KPI clickeables con modal de detalle;
- el botón de informe PDF en cada unidad;
- los informes oficiales guardados en `public/reportes/`;
- Mentat como copiloto flotante;
- las sugerencias y planes de acción;
- el menú móvil con drawer, backdrop y cierre;
- el reset de scroll al cambiar de ruta;
- los estados de resultado: Favorable `>= 80`, Atención `60–79`, Crítico `< 60`.

## 4. Pantallas que Claude Design debe entregar

Diseñar el sistema completo y una propuesta visual de cada pantalla:

1. **Resumen ejecutivo**
   - cabecera operativa;
   - franja de foco/período;
   - cuatro KPI principales;
   - resultado por categoría;
   - preguntas mejor evaluadas y oportunidades;
   - acceso claro a las unidades.

2. **Gestión Corporativa**
   - indicador separado del clima global;
   - evolución mensual;
   - equipos y preguntas corporativas;
   - descarga del informe corporativo.

3. **Unidad de negocio**
   - nombre, resultado, estado e informe descargable;
   - KPI de gestión, participación, neutrales y detractores;
   - categorías y preguntas;
   - tabla de divisiones legales;
   - planes de acción.

4. **División legal**
   - contexto de navegación;
   - resultado y participación;
   - comparación con divisiones hermanas;
   - preguntas y categorías disponibles.

5. **Organización BUK**
   - empresas, áreas y subáreas;
   - expansión y contracción de niveles;
   - conteos agregados;
   - estado y fecha de última sincronización.

6. **Mentat**
   - launcher compacto;
   - panel de chat;
   - respuestas con tablas y gráficos;
   - acción de descarga de informe PDF;
   - estados vacío, cargando, respuesta, error y cierre.

7. **Manual de usuario**
   - conservar como vista de ayuda, pero llevarla al nuevo sistema visual.

## 5. Sistema visual esperado

### Dirección

- producto interno premium;
- sobrio, claro y operativo;
- mucho espacio útil, sin hero editorial;
- densidad similar a NOW Vendedores;
- blanco, azul muy claro, navy y acentos funcionales;
- bordes finos y sombras cortas;
- radios moderados, no excesivamente redondeados;
- nada de gradientes decorativos, blobs, glassmorphism o tarjetas anidadas;
- títulos compactos y valores numéricos protagonistas;
- iconos de línea consistentes y con tooltip cuando no sean obvios.

### Tokens base sugeridos

Claude puede refinarlos, pero debe documentar cualquier cambio:

| Token | Uso | Base sugerida |
|---|---|---|
| `workspace` | fondo general | `#EEF3F7` |
| `surface` | tarjetas y paneles | `#FFFFFF` |
| `ink` | texto principal | `#142033` |
| `muted` | texto secundario | `#66778A` |
| `line` | bordes | `#DFE7EE` |
| `blue` | acción principal | `#108DC4` |
| `blue-soft` | selección | `#EAF6FC` |
| `green` | favorable | `#0B9F73` |
| `orange` | atención | `#F39A35` |
| `purple` | proyección/otro KPI | `#7B4CE2` |

### Tipografía

- mantener una sans legible y consistente;
- títulos y valores con peso fuerte;
- labels de KPI en mayúsculas pequeñas y tracking moderado;
- no usar tamaños gigantes para títulos de dashboard;
- revisar que preguntas y razones sociales no provoquen overflow.

## 6. Comportamientos obligatorios

- sidebar fija en desktop y drawer en móvil;
- elemento activo visible sin depender sólo del color;
- breadcrumbs funcionales;
- chips de unidades navegables y con scroll interno en móvil;
- filtros y período con controles reales;
- cada KPI debe abrir un modal o panel de detalle;
- las tablas deben poder desplazarse horizontalmente sólo dentro de su contenedor;
- los botones deben tener acción real o eliminarse;
- los estados hover, focus, disabled, loading y error deben estar definidos;
- Mentat no debe cubrir el CTA principal ni el campo de descarga;
- mantener accesibilidad básica: labels, foco visible, botones semánticos y contraste.

## 7. Datos y archivos que no se deben modificar por razones visuales

Fuente de clima:

- `src/data/clima.json`
- `src/data/corporativo.ts`
- `src/data/response-distribution.json`
- `src/data/action-plans.json`

Fuente BUK:

- `src/data/generated/buk-organization.json`
- `src/lib/buk.ts`
- `scripts/buk/sync-buk.mjs`

Informes oficiales:

- `public/reportes/gestion-corporativa-s1-2026.pdf`
- `public/reportes/unidades/*.pdf`
- `public/reportes/unidades/construccion-s2-2026.pdf`

Nunca incluir ni pedir el valor de `BUK_API_TOKEN`. Es un secreto de GitHub Actions y no debe aparecer en capturas, prompts, diseños, commits ni documentación compartida.

## 8. Archivos de código que debe revisar primero

- `src/components/AppShell.tsx`
- `src/components/HierarchyNav.tsx`
- `src/components/KpiCard.tsx`
- `src/components/CategoryBars.tsx`
- `src/components/QuestionList.tsx`
- `src/components/OrganizationTree.tsx`
- `src/features/mentat/MentatCopilot.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/CorporatePage.tsx`
- `src/pages/OrganizationPage.tsx`
- `src/pages/UnitDetailPage.tsx`
- `src/pages/DivisionDetailPage.tsx`
- `src/index.css`
- `tailwind.config.js`

## 9. Material de referencia

Revisar el sitio NOW Vendedores en desktop y móvil:

- https://now-vendedores.web.app/

Revisar también:

- `docs/assets/emaresa-home.png`
- `docs/assets/emaresa-unit.png`
- `docs/assets/emaresa-organization.png`
- `docs/reference/reports/A&J S1-2026.pdf`
- `docs/reference/reports/Construccion S2-2026.pdf`
- `docs/functional/EMARESA_DOCUMENTO_FUNCIONAL_PROPUESTA_COMERCIAL_v1.0.md`

Los PDF son referencia de contenido y formato de envío. No reemplazar sus archivos ni convertir el dashboard en una copia editorial del PDF.

## 10. Entregables esperados de Claude Design

Entregar, en este orden:

1. diagnóstico visual de la aplicación actual;
2. arquitectura de navegación propuesta;
3. tokens de color, tipografía, espaciado, radios y sombras;
4. componentes base y estados;
5. diseño de las siete pantallas anteriores;
6. responsive desktop, tablet y móvil;
7. código React/TypeScript/CSS implementable en este repositorio;
8. lista de archivos modificados;
9. checklist de funcionalidades preservadas;
10. capturas o preview de cada ruta principal.

No aceptar sólo una imagen, un mockup o una propuesta conceptual. La entrega debe dejar una implementación que pueda ejecutarse con `npm run dev` y compilar con `npm run build`.

## 11. Criterios de aceptación

### Visuales

- el resultado debe sentirse como una aplicación operativa de la misma familia visual que NOW Vendedores;
- no debe quedar ningún bloque con el estilo anterior mezclado;
- la jerarquía de compañía, unidad y división debe ser evidente;
- los KPI deben tener una lectura rápida y un affordance claro de click;
- el informe de clima debe ser visible desde la unidad sin buscarlo;
- el sidebar no debe competir con el contenido principal;
- el diseño debe mantener contraste y legibilidad.

### Funcionales

- todas las rutas actuales cargan;
- todos los KPI abren detalle;
- una unidad permite descargar su PDF;
- una división se puede abrir desde la tabla;
- el árbol BUK expande y contrae;
- Mentat abre, responde y se puede cerrar;
- el menú móvil funciona;
- no hay overflow horizontal global;
- build y deploy funcionan.

## 12. Prompt listo para pegar en Claude Design

```text
Trabaja sobre el repositorio existente de Emaresa Clima. Necesito un rediseño completo de UX/UI, no una landing page ni un mockup aislado.

Usa https://now-vendedores.web.app/ como referencia visual y de experiencia. Traslada su lenguaje de aplicación operativa: sidebar compacta, cabecera con período y sincronización, filtros visibles, KPI densos y clickeables, tarjetas de análisis, tablas legibles, estados claros y responsive real. No copies su marca, datos, nombres, RUT, textos ni activos.

Conserva toda la funcionalidad actual: Grupo Emaresa → unidad de negocio → división legal; snapshot BUK agregado; Gestión Corporativa separada; KPI con modal de detalle; descarga de informes PDF oficiales desde cada unidad; Mentat; planes de acción; menú móvil; HashRouter y GitHub Pages.

Antes de editar, lee:
- docs/design/CLAUDE_DESIGN_COMPLETE_REDESIGN.md
- docs/FILE_MANIFEST.md
- src/components/AppShell.tsx
- src/components/HierarchyNav.tsx
- src/components/KpiCard.tsx
- src/pages/HomePage.tsx
- src/pages/UnitDetailPage.tsx
- src/pages/DivisionDetailPage.tsx
- src/pages/OrganizationPage.tsx
- src/features/mentat/MentatCopilot.tsx
- src/index.css
- tailwind.config.js

Diseña y entrega las vistas de resumen ejecutivo, Gestión Corporativa, unidad, división legal, Organización BUK, Mentat y Manual. Define tokens, componentes, estados, responsive y código implementable. No cambies datos, reglas 80/60, rutas ni archivos PDF. No incluyas BUK_API_TOKEN.

Al terminar, ejecuta npm run build, revisa desktop 1440 px y mobile 390 px, verifica que todos los KPI sean clickeables, que el informe de una unidad descargue y que el drilldown completo siga funcionando. Entrega el listado de archivos modificados, capturas de las rutas principales y un checklist de aceptación.
```

