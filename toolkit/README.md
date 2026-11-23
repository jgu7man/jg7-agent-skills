# 📦 Marxa Digital Agent Toolkit (CLI, Repo Remoto & Plugin de Antigravity)

Este directorio contiene el **CLI en TypeScript ([mxd-skills.ts](./mxd-skills.ts))** y el manifiesto de **Plugin de Antigravity ([plugin.template.json](./plugin.template.json))** para versionar, instalar y activar tus skills en cualquier máquina o monorepo.

---

## 1. Cómo subir tus skills a un Repositorio Remoto (GitHub)

Ejecuta una sola vez dentro de `/Users/jgu7man/.gemini/config/skills`:

```bash
cd ~/.gemini/config/skills
git init
git add .
git commit -m "feat: initial Marxa Digital action skills & toolkit"
gh repo create marxa-digital/mxd-agent-skills --private --source=. --remote=origin --push
```

Cuando un compañero (o tú en otra Mac) quiera instalarlos:

```bash
git clone git@github.com:marxa-digital/mxd-agent-skills.git ~/.gemini/config/skills
```

---

## 2. Comandos del CLI (`toolkit/mxd-skills.ts`)

### Listar todos los comandos `/` disponibles
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts list
```

### Activar un preset de skills en un proyecto específico (`.agents/skills.json`)
Genera el archivo nativo `.agents/skills.json` de Antigravity con `include_only` sin duplicar carpetas:
```bash
# Preset para monorepos Nx (miss-pedidos, valley, profees)
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts use ~/Code/miss-pedidos nx-core

# Preset completo
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts use ~/Code/miss-pedidos full
```

### Empaquetar como Plugin Nativo de Antigravity
Si quieres instalar toda la suite como un **Plugin único** con switch On/Off en la página de Customizations de Antigravity (`~/.gemini/config/plugins/marxa-digital-toolkit`):
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts pack-plugin /tmp/marxa-digital-toolkit
```
*(Nota: Si los empaquetas dentro de `~/.gemini/config/plugins/` al mismo tiempo que viven sueltos en `~/.gemini/config/skills/`, Antigravity los descubriría por duplicado; usa o bien `~/.gemini/config/skills/` o bien el plugin en `~/.gemini/config/plugins/`).*

### Sincronizar cambios con el repositorio remoto
```bash
npx tsx ~/.gemini/config/skills/toolkit/mxd-skills.ts sync
```
