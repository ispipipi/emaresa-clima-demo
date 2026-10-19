# Emaresa Clima Demo

Demo funcional del Dashboard de Clima Organizacional para Grupo Emaresa.

## Stack

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- React Router DOM con HashRouter

## Setup local

```bash
npm install
npm run dev
```

## Validaciones

```bash
npm run lint
npm run build
```

## Documentación

La documentación funcional, el handoff de diseño y los archivos de referencia están organizados en `docs/`. Los informes PDF descargables permanecen en `public/reportes/` porque forman parte de los activos publicados por la aplicación.

## Informes y drilldown

La aplicación navega desde Grupo Emaresa hasta la unidad de negocio y la división legal disponible en el dataset. Los PDF originales entregados para esta demo están publicados en `public/reportes/` y se descargan sin transformación desde las vistas correspondientes.

Construcción incorpora además el informe oficial **S2 2026**, con el mismo formato del documento entregado: comparación S1/S2/Global, categorías, eNPS, ranking de preguntas y planes de acción. Se puede regenerar con `npm run report:s2:construccion`.

## Integración BUK

La organización se sincroniza durante el build desde `https://emaresa.buk.cl/api/v1/chile` usando `BUK_API_TOKEN` como secreto de GitHub Actions. El snapshot publicado contiene solo empresas, áreas, subáreas y conteos agregados de personas activas; no contiene nombres, RUT, correos ni fichas personales. La API Key no se guarda en el repositorio ni se expone como variable `VITE_*`.

El workflow también corre una sincronización programada una vez al día a las **22:00 hora de Chile** (`America/Santiago`), además de ejecutarse con cada publicación manual o cambio en `main`. El workflow usa un cron UTC de referencia y ajusta automáticamente la espera para cubrir horario de verano e invierno.

Para sincronizar localmente:

```bash
BUK_API_TOKEN=... npm run sync:buk
```

## Deploy

GitHub Pages sirve el sitio desde:

```text
https://ispipipi.github.io/emaresa-clima-demo/
```

La base publica esta configurada en `vite.config.ts` como `/emaresa-clima-demo/`.
