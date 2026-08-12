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

## Informes y drilldown

La aplicación navega desde Grupo Emaresa hasta la unidad de negocio y la división legal disponible en el dataset. Los PDF originales entregados para esta demo están publicados en `public/reportes/` y se descargan sin transformación desde las vistas correspondientes.

## Integración BUK

La organización se sincroniza durante el build desde `https://emaresa.buk.cl/api/v1/chile` usando `BUK_API_TOKEN` como secreto de GitHub Actions. El snapshot publicado contiene solo empresas, áreas, subáreas y conteos agregados de personas activas; no contiene nombres, RUT, correos ni fichas personales. La API Key no se guarda en el repositorio ni se expone como variable `VITE_*`.

El workflow también corre una sincronización programada diariamente, además de ejecutarse con cada publicación manual o cambio en `main`.

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
