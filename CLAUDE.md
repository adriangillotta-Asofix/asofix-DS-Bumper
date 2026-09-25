# asofix-DS-Bumper — Contexto

> Design System de Asofix en HTML/CSS/JS vanilla, publicado en GitHub Pages. Documenta tokens + componentes con preview renderizada y código copiable. Repo hermano de `asofix-prototipos` (consume `tokens.css`/`components.css` de acá) y de la librería React equivalente en `asofix-core/packages/bumper` (ver su propio `CONTEXT.md`).

**Última actualización:** 2026-09-25

GitHub: `adriangillotta-Asofix/asofix-DS-Bumper`. Auto-push sin preguntar cada vez, salvo aviso explícito de pausarlo para una tanda de commits.

## Archivos clave
- `css/tokens.css` — tokens de color, tipografía, radius, spacing, elevation
- `css/components.css` — estilos de todos los componentes
- `css/docs.css` — estilos del sitio de documentación
- `js/main.js` — copy de código y numeración de líneas
- `foundations/colors.html`, `typography.html`, `radius.html`, `elevation.html`
- `components/*.html` — una página por componente

## Estado (2026-09-25)
- **Repaso componente-por-componente vs Figma: COMPLETO.** Los 13 componentes (Avatar, Badge, Buttons, Cards, Checkbox&Radio, Dropdown, Inputs, Pill, Switch, Tabs, Toast, Tooltip, Modal) revisados y cerrados contra Figma "Bumper - Components".
- **Barrido de consumo de tokens: COMPLETO.** Los 13 componentes tokenizados elemento por elemento (no solo a nivel de bloque). `components.css` no tiene hex/rgba/border-radius sueltos fuera de las excepciones ya documentadas con comentario inline.
- **Migración a capa semántica (Paper vs Blanco de dos capas): CERRADA.** Superficies flotantes (dropdown, modal, cards, inputs) usan `--bg-surface` (blanco); el fondo ambiente usa Paper.
- **Foundations: sano**, verificado sin errores de sintaxis ni tokens fantasma.

## Regla de fuente de verdad (confirmada por Adrian, 2026-07-30)
**`asofix-DS-Bumper` es la fuente de verdad, no Figma.** Ante una diferencia de valor entre Figma y `tokens.css`/`components.css`, se corrige Figma — salvo que sea un bug interno de rol de token (ej. un token de fondo usado como borde), que se corrige acá sin tocar Figma. Nunca asumir automáticamente hacia qué lado corregir: preguntar.

## Pendiente / en revisión
- **Gobernanza de color con Andrés Tagle (stakeholder) y Paloma (Manual de Marca): sin resolver del todo.** Semánticos ya vueltos a la convención estándar (verde/rojo/amarillo/celeste, no derivados de marca). Dark mode descartado para producto. Anclas de Paper y el violeta `primary-500` siguen en revisión — **no tocar tokens de color hasta confirmar que esto se resolvió** (preguntar el estado si se retoma).
- **Rebrand LRPM**: nuevas foundations propuestas por brand manager (color/semánticos/radius/spacing/tipografía + Button). Alcance a producto pendiente de confirmación — no se tocó nada de `tokens.css` por esto todavía.
- `--pill-*` y otros tokens de Pill Highlight ya migrados a Neutral (no Paper) tras revisión de diseño post-cierre.
- Foundation de Spacing: existe (creada durante el barrido), pero falta el retrofit completo de `components.css` para que todo lo dimensional use `--space-*` en vez de valores en px sueltos.

## Reglas para trabajar en este repo
- "Revisá"/"fijate cómo quedó" es pedido de reporte, no autorización para tocar código — distinguir de "corregí"/"ajustá".
- Al calcular padding por geometría de Figma, usar la variante `Stroke=False` (el borde infla el bounding box y falsea el cálculo). Si el resultado no cierra visualmente, no insistir con otra estimación indirecta — pedir el valor exacto del panel de Auto Layout de Figma.
- Verificar el valor literal exportado por Figma para cada texto/color/spacing, nunca aproximar por patrón.
