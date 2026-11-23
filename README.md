# 📦 JG7 Engineering & Product Skills (`jg7-agent-skills`)

Catálogo global y agnóstico de **Skills de Acción (`/`)**, **Cadena de Subagentes de Desarrollo Continuo** y **CLI en TypeScript ([toolkit/jg7-skills.ts](./toolkit/jg7-skills.ts))** para Antigravity IDE bajo el estándar **`jg7` (`jgu7man`)**.

---

## 🏛️ Filosofía de 2 Capas: Base Global `jg7` vs. Customización por Proyecto

1. **Capa Global (`~/.gemini/config/skills/` — Estándar `jg7`)**:
   - Todos los skills aquí contenidos son **100% libres de branding de clientes o proyectos específicos**.
   - Definen el estándar de arquitectura Nx (`jg7/[scope]`, `shared/*/[scope]`, `modules/[scope]/*`, `functions/[scope]`), validación con **Zod (`*.schema.ts`)**, Angular `OnPush`/Signals, pruebas orientadas a negocio (`business-specs.md`) y flujos de Git/Jira/Confluence/Firebase.
2. **Capa Local por Proyecto (`<proyecto>/.agents/skills/` o `<proyecto>/.agents/rules/`)**:
   - Cuando una organización o proyecto particular requiere sus propios tableros de Jira, usuarios semilla, prefijos de selectores o reglas de dominio exclusivas, se instalan o extienden físicamente dentro de `<proyecto>/.agents/`.
   - Antigravity otorga **Prioridad #1 (Workspace Project)** a lo que vive en `.agents/` del proyecto sobre la configuración global.

---

## ⚡ 1. Catálogo de Comandos de Acción (`/`)

| Comando Slash | Categoría | Propósito Principal |
| :--- | :--- | :--- |
| **`/tech-plan`** | `codestyle` | **Arquitecto Pre-Código (Shift-Left)**: Diseña el Plan de Implementación por `scope` + `type` (`jg7/[scope]`, `shared/*/[scope]`, `modules/[scope]/*`, `functions/[scope]`) y define los schemas **Zod (`*.schema.ts`)** obligatorios para DB. |
| **`/sanitize-architecture`** | `codestyle` | **Saneamiento Arquitectónico**: Separación `*.model.ts` + `*.schema.ts` (`domain`) vs `*-copys.model.ts` + `*-ui.model.ts` (`ui`), `BoundaryTransformer`, cero `*Like` y `Test Smell -> Architecture Fix`. |
| **`/code-review`** | `codestyle` | **Hub de Calidad y Auditoría**: Protocolo CAT, revisión de diffs (Angular OnPush/Signals/A11y, fronteras Nx, Zod en DB), Auditoría 5D y Quality Gates Pre-PR. |
| **`/review-loop`** | `codestyle` | **Bucle `qa-code-reviewer ⇄ Coder`**: Audita el diff, persiste hallazgos en `.agents/code-review-report.md` e itera automáticamente con el Coder hasta llegar a `0 🔴` y `0 🟡`. |
| **`/refine-specs`** | `codestyle` | **Refinamiento de Negocio y Specs**: Audita reglas de negocio sin SDD burocrático, evita código dummy y sincroniza `business-specs.md`. |
| **`/bruno-qa`** | `codestyle` | **QA de Cloud Functions con Bruno**: Coordina con `qa-emulator-operator`, ejecuta colecciones `.bru` (`200` Happy Path, `400` Zod Rejection, `401/403` RBAC) contra emuladores y libera puertos al terminar. |
| **`/friendly-git`** | `codestyle` | **Git Ejecutivo**: Traduce diffs técnicos en commits amigables, Pull Requests ejecutivos y Release Notes orientadas a valor. |
| **`/pwa-install`** | `codestyle` | **UX de Instalación PWA**: Flujos no invasivos de instalación y ciclo de vida standalone en iOS 18+, Android, desktop e in-app browsers. |
| **`/execute-ticket`** | `workflow` | **Ejecución Autónoma End-to-End**: Toma una HU, lote o épica de Jira (`Ready for Dev`) y orquesta la cadena completa: `Arquitecto -> Coder -> Review Loop -> Browser UI / Bruno CFs`. |
| **`/deploy`** | `workflow` | **CI/CD & Gobernanza de Entornos**: Orquesta despliegues a `DEV`, `BETA`, `PRODUCCIÓN` (IssueOps `--no-ff`) y `HOTFIX` respetando el orden canónico `IAM -> Datos -> Reglas -> Backend -> UI`. |
| **`/jira`** | `product` | **Producto, Jira & Confluence**: Product Discovery, estimación RICE calibrada al squad, HUs en 5 secciones Markdown nativo y documentación funcional OKF2. |
| **`/confluence-authoring`** | `product` | **Autoría en Confluence Cloud**: Estándar OKF2, estructura limpia de títulos/emojis y formato XHTML/storage. |
| **`/confluence-roadmap-planner`** | `product` | **Roadmaps en Confluence**: Generación de la macro nativa `Roadmap Planner` en storage format (cero bloques Mermaid rotos). |
| **`/illustrations`** | `creative` | **Ilustraciones Editoriales (Xiaohei)**: Bocetos explicativos 16:9 dibujados a mano sobre fondo blanco puro con Xiaohei. |
| **`/procesar-estado-cuenta`** | `custom` | **Finanzas Personales**: Extracción y sincronización de estados de cuenta bancarios PDF. |
| **`/ghpr-extension-repair`** | `tooling` | **Soporte IDE**: Repara la extensión GitHub Pull Requests en Antigravity IDE cuando falla `chatSessionsProvider`. |

---

## 🛠️ 2. Cómo Instalar o Compartir Skills con el CLI (`toolkit/jg7-skills.ts`)

### A. Instalar físicamente dentro de un proyecto o repo de Code-Style (`install`)
Copia las carpetas de los skills elegidos dentro de `<destino>/.agents/skills/`:

```bash
# 1. Instalar SOLO los 8 skills puros de Code-Style & Arquitectura (ideal para compartir o auditar código)
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto codestyle

# 2. Instalar el preset Nx Core completo (incluye deploy y execute-ticket)
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto nx-core

# 3. Instalar skills específicos separados por coma
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto tech-plan,review-loop,code-review,sanitize-architecture

# 4. Instalar el preset de Producto (jira, confluence-authoring, confluence-roadmap-planner, refine-specs, friendly-git, illustrations)
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto product
```

### B. Enlazar en un proyecto sin copiar archivos (`use` -> `.agents/skills.json`)
Genera únicamente un manifiesto `.agents/skills.json` de 8 líneas que apunta a tu carpeta global filtrando con `include_only`:

```bash
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts use /ruta/a/tu-proyecto codestyle
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts use /ruta/a/tu-proyecto nx-core
```

### C. Empaquetar como Plugin Nativo de Antigravity (`plugin.json`)
```bash
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts pack-plugin /tmp/jg7-engineering-toolkit
```

### D. Listar y sincronizar
```bash
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts list
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts sync
```
