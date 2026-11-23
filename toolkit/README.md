# 📦 JG7 Engineering Toolkit (CLI, Repo Remoto & Plugin de Antigravity)

Este directorio contiene el **CLI en TypeScript ([jg7-skills.ts](./jg7-skills.ts))** y el manifiesto de **Plugin de Antigravity ([plugin.template.json](./plugin.template.json))** para versionar, instalar y activar tus skills bajo el estándar **`jg7` (`jgu7man`)**.

---

## 1. Presets Disponibles en el CLI

- **`codestyle`**: `tech-plan`, `sanitize-architecture`, `code-review`, `review-loop`, `refine-specs`, `bruno-qa`, `friendly-git`, `pwa-install`. *(100% enfocados en arquitectura, clean code, Zod, Angular/Nx y QA).*
- **`nx-core`**: Todos los de `codestyle` + `execute-ticket` y `deploy`.
- **`product`**: `jira`, `confluence-authoring`, `confluence-roadmap-planner`, `refine-specs`, `friendly-git`, `illustrations`.
- **`full`**: Los 16 skills completos.

---

## 2. Cómo Instalar los Skills en un Proyecto (`install` vs `use`)

### Opción A: Instalar físicamente dentro del proyecto (`<proyecto>/.agents/skills/`) — Comando `install`
Copia las carpetas de los skills elegidos dentro de `<proyecto>/.agents/skills/` para versionarlos en el Git del proyecto o personalizarlos localmente (tienen **Prioridad #1** en Antigravity sobre los globales):

```bash
# Instalar solo el paquete de Code-Style y Arquitectura
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto codestyle

# Instalar el paquete Nx Core
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto nx-core

# Instalar skills específicos separados por coma
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts install /ruta/a/tu-proyecto tech-plan,review-loop,code-review,bruno-qa
```

### Opción B: Enlazar sin copiar archivos (`<proyecto>/.agents/skills.json`) — Comando `use`
Genera únicamente el archivo ligero `.agents/skills.json` apuntando a tu carpeta global con `include_only`:

```bash
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts use /ruta/a/tu-proyecto codestyle
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts use /ruta/a/tu-proyecto nx-core
```

---

## 3. Otros Comandos del CLI

```bash
# Listar los 16 comandos /
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts list

# Empaquetar como Plugin nativo de Antigravity
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts pack-plugin /tmp/jg7-engineering-toolkit

# Sincronizar con el repositorio remoto (git pull --rebase)
npx tsx ~/.gemini/config/skills/toolkit/jg7-skills.ts sync
```
