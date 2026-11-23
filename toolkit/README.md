# 📦 Marxa Digital Agent Toolkit (CLI, Repo Remoto & Plugin de Antigravity)

Este directorio contiene el **CLI en TypeScript ([mxd-skills.ts](./mxd-skills.ts))** y el manifiesto de **Plugin de Antigravity ([plugin.template.json](./plugin.template.json))** para versionar, instalar y activar tus skills en cualquier máquina o monorepo.

---

## 1. Instalación Global desde el Repositorio Remoto

En cualquier máquina nueva:

```bash
git clone https://github.com/marxa-digital/mxd-agent-skills.git ~/.gemini/config/skills
```

O usando el comando `install-global` del CLI (que clona en `~/.mxd-toolkit` y registra `~/.gemini/config/skills.json`):

```bash
npx tsx toolkit/mxd-skills.ts install-global https://github.com/marxa-digital/mxd-agent-skills.git
```

---

## 2. Cómo Instalar los Skills en un Proyecto (`install` vs `use`)

### Opción A: Instalar físicamente dentro del proyecto (`<proyecto>/.agents/skills/`) — Comando `install`
Copia las carpetas de los skills elegidos dentro de `<proyecto>/.agents/skills/`.
- **Ventaja**: Puedes commitearlos en el Git del proyecto para que todo el equipo los tenga sin configurar nada globalmente, o personalizar reglas locales (tienen **Prioridad #1** en Antigravity sobre los skills globales).

```bash
# Instalar el preset Nx Core (tech-plan, execute-ticket, review-loop, code-review, sanitize-architecture, bruno-qa, refine-specs, deploy, friendly-git, pwa-install)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto nx-core

# Instalar solo skills específicos separados por coma
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto tech-plan,review-loop,code-review,bruno-qa

# Instalar el preset de Producto (jira, confluence-authoring, confluence-roadmap-planner, refine-specs, friendly-git, illustrations)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto product

# Instalar todos los skills
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts install /ruta/a/tu-proyecto full
```

### Opción B: Enlazar sin copiar archivos (`<proyecto>/.agents/skills.json`) — Comando `use`
Genera únicamente el archivo ligero `.agents/skills.json` apuntando a tu carpeta central con `include_only`:
- **Ventaja**: Cero archivos duplicados en el proyecto; cualquier mejora en tus skills globales aplica de inmediato.

```bash
# Preset para monorepos Nx (miss-pedidos, valley, profees)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts use /ruta/a/tu-proyecto nx-core

# Preset completo
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts use /ruta/a/tu-proyecto full
```

---

## 3. Otros Comandos del CLI

### Listar todos los comandos `/` disponibles
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts list
```

### Empaquetar como Plugin Nativo de Antigravity
Si quieres empaquetar toda la suite como un **Plugin único** con switch On/Off en la página de Customizations de Antigravity:
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts pack-plugin /tmp/marxa-digital-toolkit
```
*(Nota: Si los empaquetas dentro de `~/.gemini/config/plugins/` al mismo tiempo que viven sueltos en `~/.gemini/config/skills/`, Antigravity los descubriría por duplicado; usa o bien `~/.gemini/config/skills/` o bien el plugin en `~/.gemini/config/plugins/`).*

### Sincronizar cambios con el repositorio remoto
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts sync
```
