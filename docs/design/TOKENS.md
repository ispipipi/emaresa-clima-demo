# Tokens de diseño · Clima Emaresa

Sistema "Alba": marfil cálido, tinta violeta oscura (no navy) y un acento iris. Todos los tokens viven como variables CSS en `src/index.css` y Tailwind los lee desde `tailwind.config.js`. El modo oscuro está preparado: poner `data-theme="dark"` en `<html>` cambia solo las variables.

## Color

| Token | Uso | Claro |
|---|---|---|
| `--bg` | fondo de la aplicación | `#FBF9F5` |
| `--surface` | tarjetas y paneles | `#FFFFFF` |
| `--sunken` | pistas de barras, chips neutros, filas de apoyo | `#F6F3ED` |
| `--line`, `--line-soft` | bordes y separadores | `#E6E2DC`, `#EEEBE5` |
| `--ink` | texto principal y cabeceras | `#201A2C` |
| `--ink-2` | texto secundario (6,1:1 sobre blanco) | `#656070` |
| `--ink-3` | iconos y placeholders, nunca texto esencial (3,4:1) | `#8D8A97` |
| `--brand` | acción principal (texto blanco 6,1:1) | `#7A42CA` |
| `--brand-deep`, `--brand-mid` | hover y texto de marca, gráficos | `#5B2C9B`, `#905FE1` |
| `--brand-soft`, `--brand-wash` | selección, fondo de iconos y hover | `#F2ECFF`, `#F8F5FF` |

### Estados (umbrales sin cambios: Favorable ≥ 80, Atención 60–79, Crítico < 60)

| Estado | Relleno de gráfico | Fondo | Texto | Icono |
|---|---|---|---|---|
| Favorable | `--fav` `#009956` | `--fav-soft` `#D9FAE3` | `--fav-ink` `#00572E` | círculo con check |
| Atención | `--att` `#DD7000` | `--att-soft` `#FFEECD` | `--att-ink` `#7F4413` | triángulo con ! |
| Crítico | `--crit` `#DE3B3D` | `--crit-soft` `#FFEAE9` | `--crit-ink` `#9B1E22` | rombo con X |

Reglas: el estado siempre lleva icono y etiqueta (componente `StatusChip`); los rellenos de gráfico cumplen 3:1 sobre blanco y los textos sobre su fondo suave cumplen 4,5:1 o más. Los bloques del mapa y del mapa de calor usan `--fav-tile`, `--crit-tile` y una mezcla entre `--att-strong` y `--att-weak` (más intensa mientras más lejos de 80).

## Tipografía

- Plus Jakarta Sans 400–800 para todo el texto; Geist Mono solo para marcadores técnicos.
- Cifras tabulares (`tabular-nums`) en todo valor numérico; un decimal fijo (`formatPercent`).
- Escala: valor protagonista 38–44 px / 800, H1 28–44 px (fluido) / 800, H2 22–26 px / 800, texto 14–16 px, apoyo 12,5–13,5 px. Mínimo 12 px.

## Forma, elevación y movimiento

| Token | Valor |
|---|---|
| Radios | control 12 px (`rounded-ctl`), tarjeta 16 px (`rounded-card`), pastilla 999 px |
| Sombras | `--sh1` tarjeta, `--sh2` hover y resultado protagonista, `--sh3` modal, drawer y Mentat |
| Transiciones | 150–250 ms, `cubic-bezier(.2,.7,.3,1)` |
| Entrada | `animate-rise`: fade + 12 px, 240 ms; escalonada con `delay` en `Card` |
| Conteo de KPI | 900 ms (`useCountUp`) |
| Hover | las tarjetas clickeables suben 3 px y pasan a `--sh2` |
| `prefers-reduced-motion` | se anula todo (transiciones, animaciones y conteo) |

## Foco y accesibilidad

`:focus-visible` dibuja un anillo de 3 px (`--brand-mid`) con separación de 2 px. Enlace "Saltar al contenido" al inicio. Los paneles usan `role="dialog"`, devuelven el foco al cerrar y se cierran con Esc.
