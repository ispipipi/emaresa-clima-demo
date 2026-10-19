# Manifest de archivos para Claude Design

## Entrada principal

- `docs/design/CLAUDE_DESIGN_HANDOFF.md`: documento maestro con contexto, objetivos, reglas, rutas, datos, interacciones y criterios de aceptación.

## Referencias visuales

- `docs/assets/fis-intervent-reference.png`: captura de la referencia FIS Intervent.
- `docs/assets/emaresa-home.png`: captura del resumen ejecutivo.
- `docs/assets/emaresa-unit.png`: captura de la unidad A&J.
- `docs/assets/emaresa-organization.png`: captura de la organización BUK.

## Documentos funcionales de contexto

- `docs/reference/docs/EMARESA_HANDOFF-CLAUDE-CODEX_v1.1.md`: handoff histórico del primer ciclo.
- `docs/reference/docs/EMARESA_MD-FUNCIONAL-CLIMA_v1.1.md`: especificación funcional histórica.

## Datos de referencia

- `docs/functional/EMARESA_DOCUMENTO_FUNCIONAL_PROPUESTA_COMERCIAL_v1.0.md`: documento funcional para propuesta comercial.
- `src/data/clima.json`: dataset canónico consumido actualmente por la app.
- `src/data/response-distribution.json`: distribución versionada de respuestas neutrales y detractoras por unidad y período.
- `src/data/action-plans.json`: biblioteca oficial de 15 preguntas y 30 acciones estandarizadas para 2026.
- `src/data/construccion-s2-2026.json`: datos oficiales de Construcción para el informe comparativo S2 2026.
- `src/data/corporativo.ts`: resultados de Gestión Corporativa.
- `src/data/generated/buk-organization.json`: snapshot agregado de BUK, generado por la sincronización.

## Biblioteca oficial de planes de acción

- `docs/reference/action-plans/Base Planes de acción 2026.pdf`: fuente entregada por EMARESA.
- `docs/reference/reports/A&J S1-2026.pdf`: informe oficial usado para validar el desglose de neutrales y detractores.
- `docs/reference/reports/Construccion S2-2026.pdf`: informe oficial de referencia para el formato S2 2026.
- `src/components/ActionPlanSuggestions.tsx`: asociación automática de planes a las cinco preguntas con menor resultado.

## Informes oficiales para descarga

- `public/reportes/gestion-corporativa-s1-2026.pdf`
- `public/reportes/aj-s1-2026.pdf`
- `public/reportes/portadas/gestion-corporativa-s1-2026.png`
- `public/reportes/portadas/aj-s1-2026.png`

## Código de interfaz que debe revisarse primero

- `src/components/AppShell.tsx`
- `src/components/HierarchyNav.tsx`
- `src/components/KpiCard.tsx`
- `src/components/CategoryBars.tsx`
- `src/components/QuestionList.tsx`
- `src/components/ActionPlanSuggestions.tsx`
- `src/components/OrganizationTree.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/CorporatePage.tsx`
- `src/pages/OrganizationPage.tsx`
- `src/pages/UnitDetailPage.tsx`
- `src/pages/DivisionDetailPage.tsx`

## Código de datos y routing

- `src/App.tsx`
- `src/components/ScrollToTop.tsx`
- `src/lib/clima.ts`
- `src/lib/buk.ts`
- `src/lib/format.ts`
- `src/lib/reports.ts`
- `src/lib/responseDistribution.ts`
- `src/lib/mentat.ts`
- `src/lib/mentatPdf.ts`
- `src/types/clima.ts`
- `src/types/buk.ts`

## Generación de informes por unidad

- `scripts/reports/generate-unit-reports.py`: genera los 15 informes S1 2026, incluyendo la quinta prioridad y sus planes oficiales.
- `scripts/reports/generate-construction-s2-report.py`: genera el informe de Construcción S2 2026 con comparación S1/S2/Global, eNPS y planes de acción.
- `public/reportes/unidades/*.pdf`: informes descargables por unidad de negocio.
- `public/reportes/unidades/construccion-s2-2026.pdf`: informe S2 2026 disponible desde la unidad Construcción.

## Estilos y build

- `src/index.css`
- `tailwind.config.js`
- `index.html`
- `vite.config.ts`
- `package.json`
- `.github/workflows/deploy.yml`

## Comandos mínimos

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Información de publicación

- Repositorio: `https://github.com/ispipipi/emaresa-clima-demo`
- URL: `https://ispipipi.github.io/emaresa-clima-demo/`
- Rama publicada: `main`
- Commit: `8bc63dc`

## Seguridad

- No existe ningún token en este manifest.
- No incluir `BUK_API_TOKEN` en Claude Design, capturas, archivos de diseño ni commits.
- El único secreto requerido por el workflow es el secreto de GitHub Actions llamado `BUK_API_TOKEN`.
