---
name: beta-deploy
description: Orquesta y monitorea el flujo de CI/CD para el entorno BETA (Staging / UAT). Gestiona el corte de ramas release/vX.Y.Z desde develop, audita tickets frente a main, actualiza fixVersion en Jira, abre el PR hacia main, autoriza el despliegue aplicando la etiqueta 'approved', y monitorea deploy-beta-pr-approved.yml hasta certificar la versión -beta.N. Se activa con '/beta-deploy' (o '/beta') o al solicitar desplegar/monitorear en BETA.
---

# 🟡 Skill: CI/CD & Despliegue en BETA (`/beta-deploy`)

Utiliza este skill siempre que necesites **preparar, desplegar o certificar una versión candidata (Release Candidate) en el entorno BETA** (`goolima-crm-beta.web.app` / `pro-fees`).

---

## 🎯 1. Filosofía de BETA: Certificación Previa con Datos Reales

> **REGLA DE ORO:** El entorno BETA corre en el proyecto de producción (`pro-fees`), pero bajo un sitio y colección de releases totalmente aislados (`dashboard-beta` / `goolima-crm-beta`). Permite a QA certificar la aplicación con la base de datos real sin tocar a los usuarios productivos.

---

## 📋 2. Protocolo de Ejecución Paso a Paso

Al invocar `/beta-deploy`, Antigravity ejecutará el siguiente flujo estructurado:

### Paso 1: Preparación y Corte de Rama Release
1. **Determinar la versión SemVer**:
   - Preguntar o calcular la versión siguiente (ej. `v1.3.0` o `v1.3.1`).
2. **Crear la rama `release/vX.Y.Z` desde `develop`**:
   ```bash
   git checkout develop && git pull origin develop
   git checkout -b release/vX.Y.Z develop
   git push -u origin release/vX.Y.Z
   ```

### Paso 2: Auditoría de Tickets en Jira (`fixVersion`)
1. **Extraer los tickets incluidos comparando contra `main`**:
   ```bash
   git log origin/main..release/vX.Y.Z --oneline | grep -oE '(PFGO|MPS)-[0-9]+' | sort -u
   ```
2. **Actualizar Jira vía MCP**:
   - Asignar la versión comercial (`fixVersion: ['vX.Y']`) a cada uno de los tickets encontrados.

### Paso 3: Apertura del Pull Request hacia `main`
1. Abrir el PR de Release con la sección obligatoria de trazabilidad:
   ```bash
   gh pr create \
     --base main \
     --head release/vX.Y.Z \
     --title "Release vX.Y.Z: Certificación en Entorno Beta" \
     --body "## 🔗 Jira — Tickets incluidos en este Release
$(git log origin/main..release/vX.Y.Z --oneline | grep -oE '(PFGO|MPS)-[0-9]+' | sort -u | sed 's/^/* /')"
   ```
2. Esperar a que el workflow `pr-integrity-dry-run.yml` valide la rama.

### Paso 4: Autorización del Despliegue a Beta (Label `approved`)
1. Aplicar la etiqueta `approved` sobre el PR para disparar el despliegue automático:
   ```bash
   gh issue edit $(gh pr view --json number -q '.number') --add-label "approved"
   ```

### Paso 5: Monitoreo Activo del Pipeline (`deploy-beta-pr-approved.yml`)
1. Monitorear el progreso en tiempo real:
   ```bash
   gh run watch $(gh run list --workflow=deploy-beta-pr-approved.yml --limit 1 --json databaseId -q '.[0].databaseId')
   ```
2. **Acciones automatizadas que el agente verifica**:
   - Validación estricta del patrón SemVer (`release/vX.Y.Z`).
   - Resolución automática de la versión incremental en Firestore (`vX.Y.Z-beta.N`).
   - Generación de `config.json` de producción.
   - Compilación y deploy a `profees-goolima-lobby-beta` (o `dashboard-beta`).
   - **Detección y despliegue automático de Reglas e Índices** (`firestore:rules,firestore:indexes,storage`) si fueron modificados en el Release.
   - **Detección, compilación y despliegue automático de Cloud Functions** (`functions:profees-functions`) si fueron modificadas en el Release.
   - Registro de certificación en Firestore (`apps/goolima/releases`).
3. Si ocurre un fallo en el build, extraer logs con `gh run view --log-failed`.

### Paso 6: Verificación UAT y Punto de Control
1. **Comprobar el despliegue**:
   - Confirmar en `https://goolima-crm-beta.web.app` que el sidebar muestre el identificador:
     **`BETA vX.Y.Z-beta.N`**.
2. **Notificar a QA / Liderazgo**:
   - Emitir el resumen con la versión `-beta.N` y el listado de tickets listos para pruebas UAT.
3. **Advertencia de Seguridad UAT**:
   - Recordar que si se suben nuevos commits al PR, la automatización `pr-auto-unapprove-on-push.yml` removerá la etiqueta `approved`, exigiendo una nueva aprobación explícita.
