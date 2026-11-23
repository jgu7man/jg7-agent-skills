---
name: execute-ticket
description: "Toma y ejecuta de forma autónoma una Historia de Usuario, Lote de Tickets o Épica de Jira ('Ready for Dev') orquestando la cadena completa de subagentes: 1) Arquitecto (/tech-plan), 2) Coder (implementación + Zod en DB), 3) Bucle Review ⇄ Coder (/review-loop) y 4) Validación Funcional (Navegador UI / Bruno para Cloud Functions). Usar cuando el usuario invoque /execute-ticket [KEY] o pida tomar un ticket."
---

# ⚡ Ejecución Autónoma de Tickets con Subagentes (`/execute-ticket`)

Este comando dispara directamente el flujo de ejecución autónoma documentado en [jira/references/feature-execution-guide.md](file:///Users/jgu7man/.gemini/config/skills/jira/references/feature-execution-guide.md).

## Protocolo de Ejecución Directa

1. **Cargar la guía operativa**:
   - Lee obligatoriamente [feature-execution-guide.md](file:///Users/jgu7man/.gemini/config/skills/jira/references/feature-execution-guide.md) y [tech-plan/SKILL.md](file:///Users/jgu7man/.gemini/config/skills/tech-plan/SKILL.md).
2. **Secuencia de 5 Etapas**:
   - **Etapa 1 (Orquestador)**: Lee el ticket en Jira (`mxd_get_issue` / `jira_get_issue`), crea la rama `feature/<key>-<slug>` (nunca en `main` ni `develop`) y transiciona el ticket a `In Progress`.
   - **Etapa 2 (Arquitecto — `/tech-plan`)**: Genera el Plan de Implementación bajo el estándar `marxa-digital/[scope]`, `shared/*/[scope]`, `modules/[scope]/*`, `functions/[scope]` y define los schemas **Zod (`*.schema.ts`)** para DB.
   - **Etapa 3 (Coder)**: Implementa el plan aplicando Protocolo CAT, validación Zod `.parse()`/`.safeParse()` en DB y `*.spec.ts` (delegando a `firestore-rules-author` si toca `firestore.rules`).
   - **Etapa 4 (Revisor QA — `/review-loop`)**: Ejecuta el bucle `qa-code-reviewer ⇄ Coder` sobre `.agents/code-review-report.md` hasta obtener `0 🔴` y `0 🟡` + `nx affected -t typecheck,lint,test` en verde.
   - **Etapa 5 (Validador Funcional)**:
     - Si toca UI: `qa-emulator-operator` + `qa-regression-tester` / `browser`.
     - Si toca `functions/[scope]`: `qa-emulator-operator` + [bruno-qa/SKILL.md](file:///Users/jgu7man/.gemini/config/skills/bruno-qa/SKILL.md) (`bru run --env emulator`).
     - **Cierre obligatorio**: verificar que todos los puertos de emuladores queden liberados.
