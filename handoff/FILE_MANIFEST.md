# Manifest de archivos para Claude Design

## Entrada principal

- `handoff/CLAUDE_DESIGN_HANDOFF.md`: documento maestro con contexto, objetivos, reglas, rutas, datos, interacciones y criterios de aceptación.

## Referencias visuales

- `handoff/assets/fis-intervent-reference.png`: captura de la referencia FIS Intervent.
- `handoff/assets/emaresa-home.png`: captura del resumen ejecutivo.
- `handoff/assets/emaresa-unit.png`: captura de la unidad A&J.
- `handoff/assets/emaresa-organization.png`: captura de la organización BUK.

## Documentos funcionales de contexto

- `handoff/source-docs/EMARESA_HANDOFF-CLAUDE-CODEX_v1.1.md`: handoff histórico del primer ciclo.
- `handoff/source-docs/EMARESA_MD-FUNCIONAL-CLIMA_v1.1.md`: especificación funcional histórica.

## Datos de referencia

- `handoff/source-data/emaresa-clima-dataset.json`: dataset original entregado.
- `src/data/clima.json`: dataset consumido actualmente por la app.
- `src/data/corporativo.ts`: resultados de Gestión Corporativa.
- `src/data/buk-organization.json`: snapshot agregado de BUK.

## Informes oficiales para descarga

- `public/reportes/gestion-corporativa-s1-2026.pdf`
- `public/reportes/aj-s1-2026.pdf`
- `public/reportes/portadas/gestion-corporativa-s1-2026.png`
- `public/reportes/portadas/aj-s1-2026.png`

## Código de interfaz que debe revisarse primero

- `src/components/AppShell.tsx`
- `src/components/HierarchyNav.tsx`
- `src/components/KpiCard.tsx`
- `src/components/ReportCard.tsx`
- `src/components/CategoryBars.tsx`
- `src/components/QuestionList.tsx`
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
- `src/types/clima.ts`
- `src/types/buk.ts`

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
- Commit: `aba127e`

## Seguridad

- No existe ningún token en este manifest.
- No incluir `BUK_API_TOKEN` en Claude Design, capturas, archivos de diseño ni commits.
- El único secreto requerido por el workflow es el secreto de GitHub Actions llamado `BUK_API_TOKEN`.
