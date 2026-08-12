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

Esta versión no está conectada a la API de BUK. El dashboard usa el dataset estático de `src/data/clima.json`. Para conectar BUK se necesitan el ambiente/base URL, endpoints de personas y estructura organizacional, método de autenticación y permisos; los secretos deberán resolverse del lado servidor y no exponerse en variables `VITE_*`.

## Deploy

GitHub Pages sirve el sitio desde:

```text
https://ispipipi.github.io/emaresa-clima-demo/
```

La base publica esta configurada en `vite.config.ts` como `/emaresa-clima-demo/`.
