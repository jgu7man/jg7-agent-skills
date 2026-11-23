---
name: production-deploy
description: Orquesta y monitorea el flujo de CI/CD para el entorno de PRODUCCIÓN gobernado por IssueOps. Crea el Issue de despliegue, procesa la autorización con etiqueta 'approved', monitorea issueops-deploy.yml (build, deploy, auto-merge --no-ff hacia main, tagging SemVer vX.Y.Z y certificación Firestore), ejecuta sanity checks, sincroniza main a develop y actualiza Jira. Se activa con '/production-deploy' (o '/production') o al solicitar desplegar/monitorear en Producción.
---

# 🔴 Skill: CI/CD & Despliegue en PRODUCCIÓN (`/production-deploy`)

Utiliza este skill siempre que vayas a **promover y desplegar una versión certificada en el entorno de Producción** (`academy-crm.web.app` / `app-miss-pedidos.web.app`).

---

## 🎯 1. Filosofía de Producción: Gobernanza por IssueOps

> **REGLAS DE ORO DE PRODUCCIÓN:**
> 1. **Cero despliegues manuales directos**: Producción se gobierna 100% mediante **IssueOps** (`issueops-deploy.yml`).
> 2. **Auto-Merge Estándar (`--no-ff`, NUNCA squash)**: El merge hacia `main` se realiza automáticamente preservando los hashes exactos de los commits que fueron probados y certificados en Beta.
> 3. **Versionado SemVer & Git Tagging**: Se genera y publica el tag oficial `vX.Y.Z` de forma automática tras el deploy exitoso.

---

## 📋 2. Protocolo de Ejecución Paso a Paso

Al invocar `/production-deploy`, Antigravity ejecutará el siguiente flujo gobernado:

### Paso 1: Verificación de Certificación en Beta (Pre-Flight)
1. **Comprobar la rama de origen**:
   - Confirmar que la rama sea `release/vX.Y.Z` o `hotfix/vX.Y.Z`.
   - Verificar que la versión haya pasado exitosamente por Beta (`vX.Y.Z-beta.N`) y cuente con el visto bueno de QA.

### Paso 2: Solicitud de Despliegue vía IssueOps
1. **Crear el Issue de Despliegue en GitHub**:
   ```bash
   gh issue create \
     --title "[Deploy] Release vX.Y.Z" \
     --body "### 🚀 Release Deployment Request

- **Release Branch:** release/vX.Y.Z
- **Environment:** prod
- **Target Apps:** [x] core-product-academy-lobby
- **Version Bump Type:** patch

### 📝 User-Facing Changes (What's New)
$(git log origin/main..HEAD --oneline | head -n 10 | sed 's/^/* /')"
   ```
2. **Reconocimiento Automático (Acknowledge)**:
   - El workflow `issueops-deploy.yml` analiza el issue, compara commits contra `main` y publica un comentario solicitando la aprobación.

### Paso 3: Autorización Explícita (Label `approved`)
1. Tras revisar la vista previa, aplicar la etiqueta `approved` al Issue:
   ```bash
   gh issue edit <ISSUE_NUMBER> --add-label "approved"
   ```

### Paso 4: Monitoreo Activo del Despliegue (`issueops-deploy.yml`)
1. Monitorear el progreso en tiempo real:
   ```bash
   gh run watch $(gh run list --workflow=issueops-deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
   ```
2. **Acciones que el pipeline ejecuta de forma 100% automatizada**:
   - Auditoría preflight de producción.
   - Compilación con Nx y generación de `config.json` de producción.
   - Despliegue a Firebase Hosting (`academy-crm.web.app`).
   - Registro de certificación en Firestore (`apps/academy/releases/vX.Y.Z` con `status: 'certified'`).
   - **Auto-Merge con `--no-ff` (sin squash)** hacia `main`.
   - Creación y push del Git Tag canónico `vX.Y.Z`.
   - Cierre automático del Issue de despliegue.

### Paso 5: Sanity Check en Producción (Punto de Control)
1. Confirmar disponibilidad del servicio en vivo:
   - `https://academy-crm.web.app` (o dominio del producto).
   - Verificar que el sidebar muestre la versión final limpia (ej. `vX.Y.Z`, sin sufijo beta).
   - Revisar logs de Firebase Functions (`functions_get_logs`) para asegurar ausencia de errores 500 inmediatos.

### Paso 6: Tareas Post-Deploy (Sincronización & Jira)
1. **Sincronizar `main` hacia `develop`**:
   - Abrir y mergear el PR de sincronización para mantener `develop` perfectamente alineada:
     ```bash
     gh pr create \
       --base develop \
       --head main \
       --title "chore(release): sync main vX.Y.Z to develop" \
       --body "Sincronización post-release vX.Y.Z a develop"
     ```
2. **Cierre de Ciclo en Jira**:
   - Marcar la versión `vX.Y` como **Publicada (Released)** con la fecha actual.
   - Transicionar las historias vinculadas al estado **`Cerrado (Done)`**.

---

## 🚨 3. Protocolo de Rollback Inmediato (< 15 Segundos)

Si en el Sanity Check se detecta una degradación crítica o un fallo bloqueante en producción:

```bash
gh workflow run rollback-instant.yml \
  -f target-environment=prod \
  -f site-id=academy-crm \
  -f target-release-tag=vX.Y.Z-previo \
  -f rollback-rules=false
```
* Conmuta el tráfico en los servidores edge de Firebase Hosting en segundos hacia la versión previa estable, sin necesidad de compilar ni realizar commits de pánico.
