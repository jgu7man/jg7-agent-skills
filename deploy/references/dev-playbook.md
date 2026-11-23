---
name: develop-deploy
description: Orquesta y monitorea el flujo de CI/CD para el entorno de Desarrollo (DEV). Se encarga de validar el PR hacia develop, disparar y monitorear el despliegue on-demand (manual-hosting-deploy.yml vía gh CLI), verificar el canal de preview en dev, y asistir en el squash merge a develop. Se activa con '/develop-deploy' (o '/develop') o al solicitar desplegar/monitorear en DEV.
---

# 🟢 Skill: CI/CD & Despliegue en DEV (`/develop-deploy`)

Utiliza este skill siempre que necesites **desplegar, validar o monitorear un cambio en el entorno de Desarrollo (DEV)** (`crm-academy-dev.web.app` / `core-product-test`).

---

## 🎯 1. Filosofía de DEV: Despliegue On-Demand

> **REGLA DE ORO:** El despliegue a DEV **NUNCA es automático por push a develop** para no pisar pruebas de otros compañeros. Es un despliegue bajo demanda (*On-Demand*) desde la rama de feature o desde `develop`.

---

## 📋 2. Protocolo de Ejecución Paso a Paso

Al invocar `/develop-deploy`, Antigravity ejecutará el siguiente flujo:

### Paso 1: Verificación de Integridad Local (Pre-Flight)
1. **Comprobar la rama de trabajo**:
   - Verificar con `git status` que no haya cambios sin guardar.
   - Confirmar que estamos en la rama `feature/<ticket>-<slug>` o `develop`.
2. **Quality Gates rápidos**:
   - Si se realizaron cambios recientes, validar que compile con `npx nx affected -t typecheck`.

### Paso 2: Validación del Pull Request e Integridad CI
1. Si existe un PR abierto hacia `develop`:
   - Monitorear el estado del workflow automatizado `pr-integrity-dry-run.yml`:
     ```bash
     gh pr checks
     ```
   - Confirmar que las 4 revisiones (`nx format:check`, `lint`, `test`, `build dry-run`) estén en verde.

### Paso 2.5: Detección de Reglas, Índices y Cloud Functions
1. **Auditar archivos modificados en la rama frente a `origin/develop`**:
   ```bash
   CHANGED=$(git diff --name-only origin/develop...HEAD)
   HAS_RULES=$(echo "$CHANGED" | grep -E '\.(rules|indexes\.json)$' && echo "true" || echo "false")
   HAS_FUNCTIONS=$(echo "$CHANGED" | grep -E '^(functions/|libs/modules/.*/contracts/)' && echo "true" || echo "false")
   ```
2. Si `HAS_RULES` es `true`, es **obligatorio** incluir `-f deploy_rules=true`.
3. Si `HAS_FUNCTIONS` es `true`, es **obligatorio** incluir `-f deploy_functions=true`.

### Paso 3: Disparo del Despliegue a DEV
1. Disparar el workflow `manual-hosting-deploy.yml` apuntando al entorno de pruebas:
   ```bash
   gh workflow run manual-hosting-deploy.yml \
     --ref $(git branch --show-current) \
     -f target-environment=dev \
     -f app=core-product-academy-lobby \
     -f channel=live \
     -f deploy_rules=${HAS_RULES} \
     -f deploy_functions=${HAS_FUNCTIONS}
   ```
2. Capturar el ID del run generado para iniciar el monitoreo.

### Paso 4: Monitoreo Activo del Pipeline (Watch Mode)
1. Monitorear el progreso en tiempo real usando `gh run watch`:
   ```bash
   gh run watch $(gh run list --workflow=manual-hosting-deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
   ```
2. **Reporte de avance**: Informar al usuario cuando:
   - Autentique en GCP (`core-product-test`).
   - Genere `config.json` de runtime.
   - Concluya la compilación de producción con Nx.
   - Finalice la publicación en Firebase Hosting.
   - Si aplicó, informe el despliegue de Firestore Rules & Indexes y Cloud Functions.
3. **Manejo de Errores**: Si el run falla, extraer inmediatamente los logs de la tarea fallida:
   ```bash
   gh run view --log-failed
   ```

### Paso 5: Verificación de Salud & Punto de Control (Sanity Check)
1. Confirmar la disponibilidad del sitio en:
   - `https://crm-academy-dev.web.app` (o el canal preview indicado).
2. Reportar el resultado al usuario y ofrecer la acción de cierre:
   - *"Despliegue a DEV finalizado con éxito. ¿Deseas proceder al **Squash Merge** del PR hacia `develop`?"*
3. Si el usuario confirma:
   ```bash
   gh pr merge --squash --delete-branch
   ```
