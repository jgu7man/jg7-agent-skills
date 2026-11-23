# 📦 Marxa Digital Agent Skills & Toolkit (`mxd-agent-skills`)

Catálogo oficial de **Skills de Acción (`/`)**, **Cadena de Subagentes de Desarrollo Continuo** y **CLI en TypeScript ([toolkit/mxd-skills.ts](./toolkit/mxd-skills.ts))** para Antigravity IDE en proyectos de Marxa Digital.

---

## ⚡ 1. Catálogo de Comandos de Acción (`/`)

| Comando Slash | Propósito Principal |
| :--- | :--- |
| **`/tech-plan`** | **Arquitecto Pre-Código (Shift-Left)**: Diseña el Plan de Implementación por `scope` + `type` (`marxa-digital/[scope]`, `shared/*/[scope]`, `modules/[scope]/*`, `functions/[scope]`) y define los schemas **Zod (`*.schema.ts`)** obligatorios para DB. |
| **`/execute-ticket`** | **Ejecución Autónoma End-to-End**: Toma una HU, lote o épica de Jira (`Ready for Dev`) y orquesta la cadena completa: `Arquitecto -> Coder -> Review Loop -> Browser UI / Bruno CFs`. |
| **`/review-loop`** | **Bucle `qa-code-reviewer ⇄ Coder`**: Audita el diff, persiste hallazgos en `.agents/code-review-report.md` e itera automáticamente con el Coder hasta llegar a `0 🔴` y `0 🟡`. |
| **`/code-review`** | **Hub de Calidad y Auditoría**: Protocolo CAT, revisión de diffs (Angular OnPush/Signals/A11y, fronteras Nx, Zod en DB), Auditoría 5D y Quality Gates Pre-PR. |
| **`/sanitize-architecture`** | **Saneamiento Arquitectónico**: Separación `*.model.ts` + `*.schema.ts` (`domain`) vs `*-copys.model.ts` + `*-ui.model.ts` (`ui`), `BoundaryTransformer`, cero `*Like` y `Test Smell -> Architecture Fix`. |
| **`/bruno-qa`** | **QA de Cloud Functions con Bruno**: Coordina con `qa-emulator-operator`, ejecuta colecciones `.bru` (`200` Happy Path, `400` Zod Rejection, `401/403` RBAC) contra emuladores y libera puertos al terminar. |
| **`/refine-specs`** | **Refinamiento de Negocio y Specs**: Audita reglas de negocio sin SDD burocrático, evita código dummy y sincroniza `business-specs.md`. |
| **`/deploy`** | **CI/CD & Gobernanza de Entornos**: Orquesta despliegues a `DEV`, `BETA`, `PRODUCCIÓN` (IssueOps `--no-ff`) y `HOTFIX` respetando el orden canónico `IAM -> Datos -> Reglas -> Backend -> UI`. |
| **`/friendly-git`** | **Git Ejecutivo**: Traduce diffs técnicos en commits amigables, Pull Requests ejecutivos y Release Notes orientadas a negocio. |
| **`/jira`** | **Producto, Jira & Confluence**: Product Discovery (MXPD), estimación RICE calibrada al squad, HUs en 5 secciones Markdown nativo y documentación funcional OKF2. |
| **`/confluence-authoring`** | **Autoría en Confluence Cloud**: Estándar OKF2, estructura limpia de títulos/emojis y formato XHTML/storage. |
| **`/confluence-roadmap-planner`** | **Roadmaps en Confluence**: Generación de la macro nativa `Roadmap Planner` en storage format (cero bloques Mermaid rotos). |
| **`/pwa-install`** | **UX de Instalación PWA**: Flujos no invasivos de instalación y ciclo de vida standalone en iOS 18+, Android, desktop e in-app browsers. |
| **`/illustrations`** | **Ilustraciones Editoriales (Xiaohei)**: Bocetos explicativos 16:9 dibujados a mano sobre fondo blanco puro con Xiaohei. |
| **`/procesar-estado-cuenta`** | **MissFinanzas v2.0**: Extracción y sincronización de estados de cuenta bancarios PDF. |
| **`/ghpr-extension-repair`** | **Soporte IDE**: Repara la extensión GitHub Pull Requests en Antigravity IDE cuando falla `chatSessionsProvider`. |

---

## 🛠️ 2. Cómo Instalar los Skills en un Proyecto o Globalmente

El CLI [toolkit/mxd-skills.ts](./toolkit/mxd-skills.ts) soporta instalación física dentro de un proyecto, enlace ligero sin copiar archivos, instalación global y empaquetado como Plugin de Antigravity.

### A. Instalar físicamente dentro de un proyecto (`<proyecto>/.agents/skills/`) — Comando `install`
Copia las carpetas de los skills elegidos dentro de `.agents/skills/` del repositorio destino.
- **Cuándo usarlo:** Cuando quieres **versionar los skills en el Git del proyecto** para que cualquier desarrollador que clone el monorepo los tenga activos de inmediato, o cuando necesitas personalizar una regla solo para ese proyecto (los skills en `.agents/skills/` tienen **Prioridad #1** en Antigravity sobre los globales).

```bash
# 1. Instalar el preset Nx Core (tech-plan, execute-ticket, review-loop, code-review, sanitize-architecture, bruno-qa, refine-specs, deploy, friendly-git, pwa-install)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto nx-core

# 2. Instalar solo skills específicos separados por coma
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto tech-plan,review-loop,code-review,bruno-qa

# 3. Instalar el preset de Producto (jira, confluence-authoring, confluence-roadmap-planner, refine-specs, friendly-git, illustrations)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto product

# 4. Instalar los 16 skills completos
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto full
```

### B. Enlazar en un proyecto sin copiar archivos (`<proyecto>/.agents/skills.json`) — Comando `use`
Genera únicamente un manifiesto `.agents/skills.json` de 8 líneas que apunta a tu carpeta central de skills filtrando con `include_only`.
- **Cuándo usarlo:** En tu máquina local cuando no quieres duplicar carpetas y prefieres que cualquier mejora en `~/.gemini/config/skills` se refleje al instante en todos tus proyectos.

```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts use /ruta/a/tu-proyecto nx-core
```

### C. Instalación Global en una máquina nueva
```bash
git clone https://github.com/marxa-digital/mxd-agent-skills.git ~/.gemini/config/skills
```

### D. Empaquetar como Plugin Nativo de Antigravity (`plugin.json`)
Si prefieres empaquetar toda la suite como un **Plugin único** con switch On/Off en la página de Customizations de Antigravity:
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts pack-plugin /tmp/marxa-digital-toolkit
```

### E. Listar y sincronizar
```bash
# Ver los 16 comandos / y su descripción
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts list

# Traer últimos cambios del repositorio remoto (git pull --rebase)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts sync
```
