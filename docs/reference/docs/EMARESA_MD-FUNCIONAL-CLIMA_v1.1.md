# Dashboard Clima Organizacional — Grupo Emaresa (Demo funcional)
**Proyecto:** Emaresa — Automatización DO / Módulo Clima
**Cliente:** Grupo Emaresa (vía Humadis)
**Versión del MD:** v1.1.0
**Estado:** Congelado — auditado por Gemini, ajustes integrados, listo para Codex
**Fecha:** 2026-08-06
**Autor:** NPR Orchestrator (Claude)
**Aprobado por:** —

---

## 1. Contexto del proyecto

### 1.1 Descripción del sistema

Dashboard web que reemplaza el cálculo manual y el armado en Canva del informe de Clima Organizacional de Grupo Emaresa. Consume los resultados de la Encuesta Pulso de Clima (hoy exportados desde BUK como Excel) y muestra, sin intervención manual, el resultado por unidad de negocio, por categoría y por pregunta, con el mismo semáforo y reglas que usa hoy el equipo de DO.

### 1.2 Problema que resuelve

Hoy Leonardo descarga un Excel de 18 hojas por unidad de negocio, usa una IA de propósito general para calcular el resultado top-two-box, y arma manualmente un informe en Canva. El cálculo con IA ha fallado más de una vez por olvidar reglas de negocio (ej. no excluir "Gestión corporativa"), obligando a Leonardo a contrastar cada resultado contra BUK antes de confiar en él. Este sistema reemplaza ese cálculo por una regla determinística, verificable y trazable — sin IA generativa en el camino del número final.

### 1.3 Usuarios y roles

Esta primera versión (demo, Type D) es de un solo rol — no requiere login:

| Rol | Descripción | Permisos principales |
|---|---|---|
| Visor (DO / Gerencia) | Cualquier persona con el link puede navegar el dashboard | Solo lectura — sin edición, sin carga de datos desde la UI |

> No hay autenticación en esta versión. Si se decide llevar esto a producción (Type E), sección 6 de este documento deberá reescribirse con roles reales (Analista DO, Jefa DO, Gerente General, Gerentes de unidad) y permisos diferenciados, tal como se conversó en el levantamiento.

### 1.4 Stack declarado

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Frontend | React + Vite | React 18 / Vite 5 | Tailwind CSS para estilos |
| Backend | Ninguno (demo Type D) | — | Sin Cloud Functions en esta fase |
| Base de datos | Ninguna — datos estáticos | — | JSON generado a partir de los Excel de encuesta, incluido en el build |
| Autenticación | Ninguna | — | Acceso público por link (igual que otros demos NPR: Acreditator, AUDITEC) |
| Hosting / Deploy | GitHub Pages | — | Ver sección 7 |
| Librerías | `react-router-dom` (única librería adicional) | ^6.x | Usar `HashRouter`, no `BrowserRouter` — ver sección 5.2. No usar librerías de gráficos pesadas; barras y tablas se resuelven con CSS/SVG simple, como en el prototipo de referencia |

> Para estándares de stack: ver `STACK_NPR.md v1.0.0`.
> Para estándares de deploy: ver `DEPLOY.md v1.0.0`.

**Supuesto que requiere confirmación de Julio:** se asume Type D (demo, sin backend), igual que SWAT/Acreditator/AUDITEC. Si el cliente aprueba pasar directo a producción con API de BUK, este MD debe reabrirse antes de tocar Codex de nuevo (ver Anexo A).

---

## 2. Alcance

### 2.1 Qué incluye esta versión

- [x] Vista global del grupo: KPIs (resultado global, participación, gestión corporativa, unidades encuestadas), resultado por categoría, top-5/bottom-5 del grupo, ranking de las 15 unidades con semáforo.
- [x] Vista de detalle por unidad de negocio: KPIs de la unidad, resultado por categoría, detalle por división legal, top-10/bottom-10 de preguntas.
- [x] Navegación entre vista global y vista de unidad (clic en fila de la tabla → detalle; botón volver).
- [x] Cálculo de resultado 100% basado en reglas fijas (top-two-box, exclusión de Gestión corporativa, semáforo 80/60), no en IA generativa.
- [x] Datos reales de las 15 unidades de negocio, Semestre 1 2026, ya calculados y embebidos.

### 2.2 Qué NO incluye esta versión

- [ ] Conexión en vivo a la API de BUK — los datos son estáticos, generados una vez a partir de los Excel compartidos. Pasar a datos en vivo es un ciclo de Codex aparte, condicionado a que Julio obtenga el acceso de solo lectura.
- [ ] Biblioteca de planes de acción por pregunta (las 5 peores preguntas hoy se asocian a un plan de acción predefinido en la plantilla de Leonardo — ese insumo no está disponible aún).
- [ ] Comparativo histórico entre semestres (solo hay datos de S1-2026; el comparativo requiere el cierre de S2-2026).
- [ ] Análisis de comentarios cualitativos y preguntas de párrafo — explícitamente fuera de alcance según lo definido en la reunión de levantamiento.
- [ ] Autenticación y roles diferenciados.
- [ ] Módulos de Desempeño, Capacitación, R&S y SLA — quedan para ciclos de Codex posteriores, cada uno con su propio MD.

### 2.3 Módulos y prioridad

| Prioridad | Módulo | Descripción breve | Dependencias |
|---|---|---|---|
| 1 | Vista global (Home) | KPIs de grupo + ranking de unidades + top-5/bottom-5 | Ninguna |
| 2 | Vista de detalle por unidad | Categorías, divisiones, top-10/bottom-10 | Vista global (navegación) |
| 3 | Capa de datos (JSON estático) | Dataset ya calculado a partir de los 15 Excel | Ninguna — insumo ya generado, ver sección 3.2 |

---

## 3. Arquitectura y datos

### 3.1 Diagrama de módulos

```
Dataset estático (src/data/clima.json)
  └── App
        ├── HomeView (vista global)
        │     └── UnitRow (clic) → navega a UnitDetailView
        └── UnitDetailView (vista de unidad)
              └── botón "Volver" → HomeView
```

### 3.2 Estructura de datos

Los datos no viven en una base de datos — son un archivo `src/data/clima.json` generado una sola vez a partir de los 15 Excel de encuesta (script de generación ya construido y disponible, ver sección 4). Codex debe consumir este JSON tal como está, **sin recalcular ni modificar los números**.

**Estructura: `ClimaDataset`**

```ts
interface Pregunta {
  pregunta: string;
  categoria: string;
  resultado: number; // 0-100, top-two-box
}

interface Categoria {
  categoria: string;
  resultado: number; // 0-100
}

interface Division {
  nombre: string;
  enviados: number;
  respondidos: number | string; // "-" si no hay datos suficientes
  resultado: number | string;
}

interface UnidadNegocio {
  unidad: string;
  enviadas: number;
  respondidas: number;
  participacion: number;
  resultado_global: number;       // excluye "Gestión corporativa"
  resultado_gestion_corporativa: number;
  divisiones: Division[];
  categorias: Categoria[];        // sin "Gestión corporativa"
  top10: Pregunta[];
  bottom10: Pregunta[];
}

interface GlobalRollup {
  enviadas: number;
  respondidas: number;
  participacion: number;
  resultado_global: number;
  resultado_gestion_corporativa: number;
  categorias: Categoria[];
  top5: Pregunta[];
  bottom5: Pregunta[];
  ranking_unidades: Array<{
    unidad: string;
    resultado: number;
    participacion: number;
    enviadas: number;
    respondidas: number;
  }>;
}

interface ClimaDataset {
  global: GlobalRollup;
  unidades: UnidadNegocio[];
}
```

### 3.3 Integraciones externas

Ninguna en esta versión. No hay llamadas a BUK ni a ningún servicio externo — el dataset es estático.

---

## 4. Módulos funcionales

### MÓDULO: Vista global (Home)

**Descripción:**
Pantalla de entrada. Muestra el estado de clima de todo el grupo: KPIs principales, resultado por categoría, top-5/bottom-5 de preguntas a nivel grupo, y una tabla con las 15 unidades de negocio ordenadas de mejor a peor resultado.

**Flujo de usuario:**

1. Usuario abre la URL raíz del sitio.
2. Ve 4 tarjetas de KPI: Resultado global del grupo (con semáforo), Participación, Resultado de Gestión Corporativa, Número de unidades encuestadas.
3. Ve un bloque con barras horizontales de resultado por categoría (Orgullo y propósito, Bienestar y equilibrio, Colaboración, Liderazgo y comunicación, Equidad y reconocimiento).
4. Ve dos listas: las 5 preguntas mejor evaluadas y las 5 peor evaluadas del grupo, cada una con su categoría.
5. Ve una tabla con las 15 unidades de negocio: nombre, resultado con semáforo, participación, respondidas/enviadas.
6. Hace clic en cualquier fila → navega a la vista de detalle de esa unidad (sección siguiente).

**Reglas de cálculo (ya resueltas en el dataset, Codex solo debe respetarlas al renderizar):**
- Semáforo: verde si resultado ≥ 80, amarillo si 60–79, rojo si < 60.
- El resultado de "Gestión corporativa" se muestra aparte, nunca se mezcla con el resultado global ni con las categorías del gráfico principal.

**Criterios de aceptación:**
- [ ] Las 4 tarjetas de KPI muestran los valores exactos del campo `global` del dataset.
- [ ] El semáforo de cada tarjeta y de cada fila de la tabla corresponde exactamente a los umbrales declarados (80/60).
- [ ] La tabla de unidades está ordenada de mayor a menor resultado (ya viene ordenada en `ranking_unidades`, no reordenar con otro criterio).
- [ ] Clic en una fila navega a la vista de detalle de esa unidad sin recargar la página completa (navegación vía `HashRouter`, ver sección 5.2).
- [ ] Responsive: las tarjetas de KPI se apilan correctamente en mobile (breakpoint 768px) y el contenedor de la tabla de unidades usa `overflow-x-auto` en ese mismo breakpoint (sección 5.4, punto 3) — la tabla nunca rompe el layout ni trunca columnas.

---

### MÓDULO: Vista de detalle por unidad de negocio

**Descripción:**
Pantalla que reemplaza el informe individual que hoy arma Leonardo en Canva por unidad de negocio. Muestra el resultado de esa unidad, su desglose por categoría, por división legal, y el ranking de sus 10 mejores y 5 peores preguntas.

**Flujo de usuario:**

1. Usuario llega desde un clic en la tabla de la vista global (o navega directo a una ruta con el nombre de la unidad, si se implementa con rutas).
2. Ve un botón "Volver al resumen del grupo" en la parte superior.
3. Ve el nombre de la unidad, su participación, y su resultado con semáforo grande.
4. Ve 3 tarjetas de KPI: resultado de la unidad, resultado de Gestión Corporativa, participación.
5. Ve el resultado por categoría en barras horizontales.
6. Ve una tabla de detalle por división legal (nombre de la razón social dentro de la unidad, enviados, respondidos, resultado — puede haber más de una división legal dentro de una misma unidad de negocio, ver campo `divisiones`).
7. Ve la lista de las **10 preguntas mejor evaluadas y las 10 preguntas peor evaluadas** de esa unidad (`top10` y `bottom10` del schema — sección 3.2), consistente con la estructura de datos ya generada.
8. Ve una nota explícita indicando que la biblioteca de planes de acción aún no está cargada (texto exacto en sección 5.4, punto 2 — no inventar planes de acción).
9. Clic en "Volver" → regresa a la vista global, con reset de scroll a `top: 0` (sección 5.4, punto 1).

**Criterios de aceptación:**
- [ ] Todos los valores mostrados provienen del objeto de esa unidad en `unidades[]`, sin recalcular nada.
- [ ] Se muestran exactamente 10 preguntas en el bloque de mejor evaluadas y 10 en el de peor evaluadas (`top10` y `bottom10` completos, no truncados a 5).
- [ ] Si una división tiene `respondidos: "-"` o `resultado: "-"`, se muestra un guion, nunca `0` ni `NaN`.
- [ ] El botón "Volver" regresa siempre a la vista global, con scroll reseteado a `top: 0` (no scroll abrupto ni posición heredada de la vista anterior).
- [ ] No se muestra ningún plan de acción inventado — la nota de "pendiente" está presente con el texto exacto de la sección 5.4.
- [ ] La ruta `/#/unidad/:nombre` es accesible directamente (recarga de página o link compartido) sin producir 404.

---

## 5. Diseño de interfaz

### 5.1 Pantallas requeridas

| Pantalla | Ruta | Descripción | Rol que accede |
|---|---|---|---|
| Resumen del grupo | `/` | Vista global descrita en el módulo 1 | Todos (público) |
| Detalle de unidad | `/unidad/:nombre` | Vista de detalle descrita en el módulo 2 | Todos (público) |

> **Decisión fijada (post-auditoría Gemini):** el enrutamiento se implementa con `HashRouter` de `react-router-dom` (rutas del tipo `/#/unidad/A%26J`), no `BrowserRouter`. GitHub Pages no soporta rewrites de subrutas del lado del servidor, así que cualquier ruta "limpia" fuera de `/` produce un 404 al recargar o al compartir el link directo. `HashRouter` evita ese riesgo por completo sin requerir configuración adicional de servidor. No usar manejo de estado en cliente sin rutas — se pierde la capacidad de compartir el link directo a una unidad, que es parte del criterio de aceptación de esta versión.

### 5.2 Flujo de navegación

```
/  (HashRouter → /#/)
  → clic en fila de unidad → /#/unidad/:nombre
/#/unidad/:nombre
  → clic en "Volver" → /#/
  → al llegar a esta vista, el scroll se resetea a top:0 (ver sección 5.4)
```

### 5.3 Criterios visuales

| Criterio | Valor |
|---|---|
| Sistema de diseño | Tailwind CSS, sin librería de componentes adicional |
| Paleta de colores | Fondo `#FAF8FF` / tarjetas `#FFFFFF`, texto `#14151A`, acento `#0055FF`, verde `#16A34A` / fondo `#EAFBF1`, amarillo `#CA8A04` / fondo `#FFF8E5`, rojo `#DC2626` / fondo `#FDECEC` |
| Tipografía | Hanken Grotesk para títulos, Inter para texto — mismas fuentes que NPR Business OS |
| Responsividad | Mobile first, breakpoint principal en 768px (grid de KPIs pasa de 4 a 2 columnas) |
| Modo oscuro | No requerido |
| Referencia de diseño | Prototipo funcional ya construido: `emaresa-clima-demo.html` (usar como referencia visual y de estructura de datos, no como código a copiar literal — Codex debe producir componentes React equivalentes) |

### 5.4 Comportamiento de interfaz (fijado post-auditoría Gemini)

Estos cuatro puntos son requerimientos explícitos, no opcionales — quedaban implícitos en v1.0.0 y la auditoría de Gemini los marcó como ambigüedad a cerrar antes de construir:

1. **Reset de scroll:** al navegar entre `/` y `/unidad/:nombre` (en cualquier dirección), la vista debe hacer scroll a `top: 0` inmediatamente después del cambio de ruta. Implementar con un `useEffect` en el componente de layout que escuche cambios de ruta (`useLocation` de `react-router-dom`) y ejecute `window.scrollTo(0, 0)`.
2. **Nota de planes de acción:** el texto debe ser exactamente el siguiente, sin parafrasear ni acortar:
   > *Nota: La biblioteca de planes de acción por pregunta estará disponible en la versión de producción.*
3. **Tabla de unidades en mobile:** el contenedor de la tabla de la vista global (`Resultado por unidad de negocio`) debe tener `overflow-x-auto` en breakpoints menores a 768px, para que la tabla haga scroll horizontal en vez de romper el layout o truncar columnas.
4. **Fuentes:** importar Hanken Grotesk e Inter vía Google Fonts directamente en `index.html` (no vía `@import` en CSS, por performance de carga):
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
   ```

---

## 6. Seguridad y accesos

No aplica en esta versión — sistema de solo lectura, sin autenticación, sin datos sensibles individuales (los datos son agregados por unidad de negocio, no por persona). Si este proyecto avanza a producción con datos en vivo desde BUK, esta sección debe reescribirse completa antes de ese ciclo de Codex.

---

## 7. Deploy y entornos

### 7.1 Entornos requeridos

| Entorno | Plataforma | Branch | Propósito |
|---|---|---|---|
| Local | — | feature/clima-dashboard | Desarrollo activo |
| Producción (demo) | GitHub Pages | main | Demo para revisión de Julio y eventual presentación al cliente |

### 7.2 Variables de entorno requeridas

Ninguna — no hay backend ni claves en esta versión.

### 7.3 Configuración de build (fijado post-auditoría Gemini)

GitHub Pages sirve el proyecto desde una subruta (`https://ispipipi.github.io/emaresa-clima-demo/`), no desde la raíz del dominio. Sin declarar `base` explícitamente en Vite, los assets del build (JS, CSS, fuentes) se referencian con rutas absolutas desde `/`, lo que rompe el sitio en producción aunque funcione perfecto en local. `vite.config.js` **debe** incluir:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/emaresa-clima-demo/',
})
```

Esto es obligatorio y no opcional — es la causa más común de un demo NPR que funciona en `npm run dev` pero se ve roto (sin estilos, pantalla en blanco) una vez desplegado en GitHub Pages.

### 7.4 Instrucciones de setup

```bash
git clone https://github.com/ispipipi/emaresa-clima-demo.git
npm install
npm run dev
```

Repo confirmado por Julio: `ispipipi/emaresa-clima-demo`.

---

## 8. Criterios de cierre

### 8.1 Definición de done por módulo

- [ ] Los criterios de aceptación de la sección 4 están cumplidos.
- [ ] El build de producción (`npm run build`) corre sin errores.
- [ ] Los números mostrados coinciden exactamente con `clima.json` (verificación manual contra al menos 3 unidades antes de dar por bueno).
- [ ] Julio revisó el deploy de GitHub Pages y aprobó.

### 8.2 Criterios de aceptación del cliente (uso interno NPR, no enviar a Emaresa aún)

- [ ] Julio puede navegar del resumen global a cualquiera de las 15 unidades y volver, sin errores.
- [ ] Los números de al menos una unidad (recomendado: A&J, ya validada contra el PDF real) coinciden con el informe PDF que Emaresa compartió.
- [ ] El sitio funciona correctamente en Chrome de escritorio y en un celular (responsive).

### 8.3 Checklist pre-entrega

- [ ] Deploy en GitHub Pages funcionando.
- [ ] README con instrucciones de setup.
- [ ] No hay errores en consola del navegador.
- [ ] CHANGELOG.md registra la versión entregada.

---

## Anexo A — Decisiones abiertas

| # | Decisión pendiente | Opciones | Impacto si no se resuelve | Responsable |
|---|---|---|---|---|
| 1 | ~~Nombre y creación del repo destino~~ | **Resuelto — `ispipipi/emaresa-clima-demo`** confirmado por Julio | — | Julio |
| 2 | ~~¿Se audita este MD con Gemini antes de enviarlo a Codex?~~ | **Resuelto — Sí, se audita primero.** Ver `EMARESA_GEMINI-AUDIT-PROMPT_v1.0.md` | — | Julio |
| 3 | Confirmación de que el stack es Type D (demo, sin backend) y no directo a producción | A) Confirmar Type D / B) Ir directo a Type E con API de BUK | Cambia stack, esfuerzo y contenido completo de este MD | Julio |

## Anexo B — Historial de cambios del MD

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| v1.0.0 | 2026-08-06 | Versión inicial, alcance limitado al módulo Clima como demo Type D | Claude |
| v1.1.0 | 2026-08-06 | Ajustes integrados desde veredicto de auditoría Gemini: (1) enrutamiento fijado a `HashRouter`, (2) `vite.config.js` con `base: '/emaresa-clima-demo/'` declarado en sección 7.3, (3) corregida inconsistencia top10/bottom10 en sección 4 (antes decía "5 peor evaluadas", el schema siempre tuvo `bottom10`), (4) sección 5.4 nueva: reset de scroll, texto exacto de nota de planes de acción, `overflow-x-auto` en tabla móvil, importación de fuentes en `index.html`. MD congelado. | Claude |

---

## Estado del documento

| Campo | Estado |
|---|---|
| Decisiones abiertas | 1 (Anexo A #3 — Type D vs Type E, no bloqueante: ya asumido Type D) |
| Auditado por Gemini | Sí — veredicto integrado en esta versión (v1.1.0) |
| Aprobado por Julio | Sí (repo y ruta de auditoría confirmados; ajustes de Gemini instruidos directamente por Julio) |
| Listo para Codex | **Sí — congelado** |
