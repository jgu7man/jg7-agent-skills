---
name: hotfix-deploy
description: Orquesta el ciclo de vida y CI/CD completo de un HOTFIX de emergencia en producción. Corta la rama hotfix/vX.Y.Z directamente desde main, guía la reparación quirúrgica con Protocolo CAT, ejecuta Quality Gates, gestiona el paso exprés por Beta, promueve a Producción vía IssueOps y asegura la sincronización obligatoria de main a develop. Se activa con '/hotfix-deploy' (o '/hotfix') o diciendo 'hotfix'.
---

# 🚨 Skill: Gestión & CI/CD de Hotfix de Emergencia (`/hotfix-deploy`)

Utiliza este skill siempre que ocurra un **error bloqueante, fuga de datos o incidente crítico en Producción** que requiera una solución quirúrgica inmediata y su despliegue a través del pipeline seguro.

---

## 🎯 1. Reglas de Oro de un Hotfix

> 1. **La rama NUNCA se corta de `develop`**: Todo hotfix se origina **estrictamente desde `main`** para garantizar que no arrastre código en progreso de otros desarrolladores.
> 2. **Reparación Quirúrgica**: Modificar únicamente lo necesario para subsanar el fallo. Quedan prohibidos refactorings cosméticos en un hotfix.
> 3. **Paso por Beta Exprés**: Debe certificarse al menos 3 a 5 minutos en el entorno Beta antes de tocar Producción.
> 4. **Sincronización Obligatoria a `develop`**: Tras publicar en Producción, es mandatorio mergear `main` hacia `develop` para que la corrección no se pierda en futuros releases.

---

## 📋 2. Protocolo de Ejecución Paso a Paso

Al activar `/hotfix-deploy`, Antigravity ejecutará el siguiente ciclo guiado:

### Paso 1: Recepción del Incidente y Diagnóstico
1. **Entender el problema**:
   - Analizar el reporte del usuario, logs de error o ticket de Jira asociado.
   - Identificar el componente o servicio culpable.

### Paso 2: Corte de Rama desde `main` (Git Safety)
1. **Obtener la última versión de Producción**:
   ```bash
   git checkout main && git pull origin main
   ```
2. **Calcular el SemVer Patch**:
   - Si producción está en `v1.3.0`, el hotfix será `v1.3.1`.
3. **Crear y publicar la rama `hotfix/vX.Y.Z`**:
   ```bash
   git checkout -b hotfix/vX.Y.Z main
   git push -u origin hotfix/vX.Y.Z
   ```

### Paso 3: Reparación Quirúrgica & Quality Gates
1. **Implementar el fix**:
   - Aplicar la corrección cumpliendo estrictamente con:
     - Cero `any`.
     - String enums para catálogos.
     - Cero boolean leakage.
2. **Correr Quality Gates (`feature-verify`)**:
   - `npx nx affected -t typecheck` (cero errores).
   - `npx nx affected -t test -- --bail` (añadir un test unitario que reproduzca y evite la regresión).

### Paso 4: Certificación Rápida en BETA (Smoke Test)
1. **Abrir PR de Hotfix hacia `main`**:
   ```bash
   gh pr create \
     --base main \
     --head hotfix/vX.Y.Z \
     --title "Hotfix vX.Y.Z: [Descripción corta del fix]" \
     --body "## 🚨 Hotfix de Emergencia
- **Causa Raíz:** [Explicación]
- **Solución Quirúrgica:** [Explicación]
- **Tickets Jira:** [ID-Ticket]"
   ```
2. **Autorizar despliegue en Beta**:
   ```bash
   gh issue edit $(gh pr view --json number -q '.number') --add-label "approved"
   ```
3. **Monitorear `deploy-beta-pr-approved.yml`**:
   - Esperar a que la versión `vX.Y.Z-beta.0` quede publicada en `academy-crm-beta.web.app`.
   - Realizar comprobación rápida de 3 minutos validando que el bug esté resuelto.

### Paso 5: Despliegue a Producción (IssueOps)
1. **Abrir el Issue de Despliegue**:
   ```bash
   gh issue create \
     --title "[Deploy] Release vX.Y.Z" \
     --body "### 🚀 Hotfix Deployment Request

- **Release Branch:** hotfix/vX.Y.Z
- **Environment:** prod
- **Target Apps:** [x] core-product-academy-lobby
- **Version Bump Type:** patch

### 📝 User-Facing Changes (What's New)
* Hotfix urgente: [Descripción del fix]"
   ```
2. **Aprobar el Issue**:
   - Aplicar label `approved`:
     ```bash
     gh issue edit <ISSUE_NUMBER> --add-label "approved"
     ```
3. **Monitorear `issueops-deploy.yml`**:
   - Esperar el deploy en `academy-crm.web.app`.
   - Confirmar el Auto-Merge (`--no-ff`) hacia `main`.
   - Confirmar la creación del tag `vX.Y.Z`.

### Paso 6: Sincronización Crítica de Retorno (`main` -> `develop`)
Para que `develop` no quede desfasada con respecto al hotfix:
1. **Crear PR de sincronización**:
   ```bash
   gh pr create \
     --base develop \
     --head main \
     --title "chore(hotfix): sync main hotfix vX.Y.Z to develop" \
     --body "Sincronización automática de hotfix vX.Y.Z aplicado en producción"
   ```
2. **Merge del PR de sync**:
   - Mergear el PR hacia `develop` para sellar la alineación del repositorio.

---

## ⚡ 3. Modo de Uso

Simplemente escribe:
> **`/hotfix`** o **`Antigravity, hotfix: los usuarios no pueden descargar el PDF de la orden MPS-204`**

Antigravity te guiará inmediatamente cortando la rama desde `main`, aplicando el fix y conduciendo el CI/CD hasta la sincronización final con `develop`.
