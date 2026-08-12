---
## HANDOFF — Claude → Codex

### Metadatos
Proyecto:          Emaresa — Automatización DO / Módulo Clima
Cliente:           Grupo Emaresa (vía Humadis)
Versión HANDOFF:   HANDOFF-02
Fecha de emisión:  2026-08-06
Emitido por:       Claude (NPR Orchestrator)
Destinatario:      Codex
Estado del proyecto: Construcción — demo funcional
Urgencia:          Alta (compromiso verbal de Julio con el cliente: demo funcional en menos de una semana desde el 29 de julio)

---

### 1. Contexto del proyecto
Objetivo del proyecto: reemplazar el cálculo manual y el armado en Canva del informe de Clima Organizacional de Grupo Emaresa por un dashboard automático, con reglas fijas y auditables, que además sirva de base para los módulos de Desempeño, Capacitación y R&S en ciclos futuros.
Tipo de trabajo NPR:   D — Demo funcional
Etapa actual:          Documento funcional v1.1.0 congelado (auditado por Gemini, ajustes integrados: HashRouter, base de Vite, top10/bottom10, comportamiento UX). Repo aún no existe — su creación es la primera tarea de este ciclo (ver sección 3).
Historial relevante:   El cálculo se verificó contra el informe PDF real de la unidad A&J compartido por el cliente y coincide al decimal (metodología top-two-box, exclusión de "Gestión corporativa", semáforo 80/60). El cliente explícitamente pidió que ningún número final salga de una IA generativa sin regla fija de por medio — este dashboard cumple esa condición porque todo el cálculo ya está resuelto en el dataset, Codex solo debe renderizarlo.

---

### 2. Contrato de entrada verificado
□ Documento funcional completo: Disponible — `EMARESA_MD-FUNCIONAL-CLIMA_v1.1.0.md` (congelado, auditado por Gemini)
□ Stack declarado con tecnologías específicas y versiones: React 18 + Vite 5 + Tailwind CSS + react-router-dom ^6.x (HashRouter), sin backend (ver sección 1.4 del MD)
□ Repo destino con URL y branch de trabajo: `ispipipi/emaresa-clima-demo` (nombre confirmado por Julio) — **Codex debe crearlo, ver sección 3, tarea 1**
□ Criterios de aceptación testeables por módulo: Disponible — sección 4 del MD v1.1.0
□ Exclusiones explícitas del ciclo: Disponible — sección 2.2 del MD
□ Supuestos visibles: Disponible — sección 1.4 del MD (Type D asumido) y Anexo A

Estado de verificación: **COMPLETO**
El repo no existe todavía, pero su creación queda instruida explícitamente como la primera tarea de este ciclo (sección 3) — no es un bloqueante para emitir este handoff, es parte del trabajo que Codex debe ejecutar.

---

### 3. Tarea de este ciclo
Objetivo específico:  Construir la versión React/Vite/Tailwind del dashboard de Clima Organizacional, reemplazando el prototipo HTML de referencia por una aplicación estructurada según el stack NPR estándar, desplegada en GitHub Pages.

**Tarea 1 — Crear el repositorio (bloqueante, primer paso del ciclo):**

```bash
gh repo create ispipipi/emaresa-clima-demo --public --description "Demo funcional — Dashboard Clima Organizacional, Grupo Emaresa" --clone
cd emaresa-clima-demo
```

- El repo **debe ser público** — GitHub Pages en el tier gratuito de NPR solo publica repos públicos.
- Estructura inicial: proyecto Vite + React + TypeScript (`npm create vite@latest . -- --template react-ts`), Tailwind configurado, `react-router-dom` instalado.
- Commit inicial a `main` con el scaffold vacío antes de crear el branch de trabajo.
- Crear y moverse a branch `feature/clima-dashboard` para todo el desarrollo — no commitear directo a `main`.
- Agregar `.env.example` (vacío, ya que no hay variables de entorno en esta versión, pero el archivo debe existir por estándar NPR — ver `DEPLOY.md §5.3`).
- Agregar `.github/workflows/deploy.yml` con build + deploy automático a GitHub Pages en cada push a `main` (usar `actions/deploy-pages` o el equivalente estándar NPR — ver `DEPLOY.md §6.2`). El token del workflow (`GITHUB_TOKEN`) ya viene provisto por GitHub Actions, no requiere PAT adicional para este paso.
- En GitHub → Settings → Pages: configurar Source = "GitHub Actions" (no branch `gh-pages` manual, para que quede automatizado desde el primer deploy).
- Verificar que `vite.config.js` tiene `base: '/emaresa-clima-demo/'` (sección 7.3 del MD) — sin esto el deploy se ve roto aunque el build pase.

**Tarea 2 — Construir los módulos funcionales:**

Alcance:              Módulos "Vista global (Home)" y "Vista de detalle por unidad" descritos en la sección 4 del MD v1.1.0. Consumo del dataset estático `clima.json` tal como se entrega, sin recalcular ningún valor. Enrutamiento con `HashRouter` (sección 5.2 del MD).
Exclusiones:          No conectar a la API de BUK. No inventar planes de acción. No implementar autenticación. No construir los módulos de Desempeño, Capacitación, R&S o SLA — quedan para ciclos posteriores con su propio MD.
Restricciones:        Ningún valor numérico puede diferir del dataset entregado. Si Codex detecta una inconsistencia en los datos, debe reportarla en el contrato de salida, no corregirla silenciosamente.
Supuestos asumidos:   Demo público sin login (Type D). Deploy en GitHub Pages vía GitHub Actions. Sin variables de entorno reales.

---

### 4. Entregables del ciclo anterior

| Entregable | Tipo | Ubicación | Estado |
|---|---|---|---|
| Documento funcional técnico | MD | `EMARESA_MD-FUNCIONAL-CLIMA_v1.1.0.md` | Congelado — auditado por Gemini |
| Dataset calculado | JSON | `emaresa-clima-dataset.json` (entregado como archivo independiente — copiar a `src/data/clima.json` en el repo) | Validado |
| Prototipo funcional validado | HTML autocontenido | `emaresa-clima-demo.html` | Validado — cálculo verificado contra PDF real del cliente; usar como referencia visual y de comportamiento, no como fuente del dataset |

---

### 5. Criterios de éxito
□ El repo `ispipipi/emaresa-clima-demo` existe, es público, y tiene el workflow de deploy automático configurado.
□ Las dos pantallas (Home y Detalle de unidad) están construidas y navegables vía `HashRouter`.
□ Todos los valores numéricos coinciden exactamente con el dataset — verificar al menos la unidad A&J contra el PDF real.
□ El build de producción corre sin errores (`npm run build`), con `base: '/emaresa-clima-demo/'` configurado.
□ El deploy en GitHub Pages es accesible públicamente en `https://ispipipi.github.io/emaresa-clima-demo/`.
□ Responsive verificado en mobile (breakpoint 768px), incluyendo `overflow-x-auto` en la tabla de unidades.
□ Reset de scroll a `top: 0` al navegar entre vistas, en ambas direcciones.
□ Texto exacto de la nota de planes de acción presente (sección 5.4 del MD).
□ No hay botones, links o elementos sin función (regla absoluta de demos, ORCHESTRATOR §13).

---

### 6. Formato de retorno esperado
Codex debe devolver:
□ Estado: Completo / Parcial / Bloqueado
□ Archivos creados con rutas completas
□ Funcionalidades implementadas contra los criterios de la sección 5 de este handoff
□ Decisiones técnicas tomadas (ej. si usó rutas reales o estado en cliente para la navegación)
□ Deuda técnica identificada
□ Próximo paso sugerido (QA con Gemini recomendado antes de mostrar al cliente)

Formato: usar la estructura estándar de `HANDOFF.md §05.3`

---

### 7. Brechas y decisiones pendientes

| Brecha | Clasificación | Impacto si no se resuelve |
|---|---|---|
| Repo destino no creado aún | Resuelta en este handoff | Codex lo crea como Tarea 1 de este ciclo (sección 3) — no requiere volver a Claude |
| MD no auditado por Gemini | Resuelta | Auditado — ajustes integrados en v1.1.0 |
| Confirmación de Type D vs. Type E | No bloqueante | Type D confirmado. Si cambia a Type E, este MD y este handoff quedan obsoletos |

Decisiones que Codex puede tomar autónomamente:
- Detalles de implementación del workflow de GitHub Actions (`deploy.yml`), siempre que cumpla el resultado declarado en la Tarea 1.
- Estructura interna de componentes, siempre que respete las pantallas y criterios de aceptación declarados.

Decisiones que requieren escalar a Claude / Julio:
- Cualquier cambio en las reglas de cálculo (top-two-box, exclusión de Gestión corporativa, semáforo).
- Cualquier ajuste de alcance (agregar módulos, agregar autenticación, conectar a BUK).
- Si el repo `ispipipi/emaresa-clima-demo` ya existe con contenido distinto al esperado (no sobreescribir sin confirmar con Julio).

---

### 8. Panel Operativo al momento del handoff
| Campo | Estado |
|---|---|
| Proyecto | Emaresa — Módulo Clima |
| Cliente | Grupo Emaresa |
| Tipo de trabajo | D — Demo funcional |
| Estado operativo | Construcción — handoff a Codex listo para ejecutar, sin bloqueantes |
| Herramienta emisora | Claude |
| Herramienta receptora | Codex |
| Entregables completados | MD Funcional v1.1.0 (congelado, auditado por Gemini), prototipo HTML validado, dataset calculado |
| Entregables pendientes | Repo creado, app React/Vite construida, deploy en GitHub Pages |
| Bloqueantes | Ninguno |
| Riesgo tokens | Bajo — MD acotado a un solo módulo, con dataset ya resuelto |
| Avance estimado | 50% del módulo Clima (documento congelado y auditado; construcción en stack NPR pendiente) |
---
