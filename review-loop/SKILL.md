---
name: review-loop
description: "Ejecuta el bucle iterativo de revisión y corrección de código (qa-code-reviewer ⇄ Subagente Coder) sobre la rama actual usando .agents/code-review-report.md hasta dejar 0 hallazgos bloqueantes (🔴) y 0 deuda técnica (🟡), validando con nx affected -t typecheck,lint,test. Usar cuando el usuario invoque /review-loop o pida iterar el code review automáticamente."
---

# 🔁 Bucle Iterativo de Code Review y Corrección (`/review-loop`)

Este comando lanza directamente el **Bucle de Reparación Continua (`qa-code-reviewer ⇄ Coder`)** definido en [code-review/SKILL.md](file:///Users/jgu7man/.gemini/config/skills/code-review/SKILL.md).

## Protocolo de Ejecución Directa

1. **Leer las reglas base**:
   - Carga [code-review/SKILL.md](file:///Users/jgu7man/.gemini/config/skills/code-review/SKILL.md) y [sanitize-architecture/SKILL.md](file:///Users/jgu7man/.gemini/config/skills/sanitize-architecture/SKILL.md).
2. **Ronda $N$ — Auditoría (`qa-code-reviewer`)**:
   - Invoca al subagente **`qa-code-reviewer`** sobre el `git diff` actual.
   - Escribe o actualiza la tabla de hallazgos en **`.agents/code-review-report.md`** con estado `OPEN` (`🔴 Bloqueante`, `🟡 Deuda Técnica`, `🟢 Scout`).
3. **Reparación Delegada (Subagente Coder)**:
   - Mientras existan hallazgos 🔴 o 🟡 en estado `OPEN`:
     - Si ya existe un subagente Coder activo en la sesión, envíale un mensaje con **`send_message`** (`Recipient: coderConversationId`); si no existe, lanza uno con `invoke_subagent` (`TypeName: "self"`, `Role: "Code Review Fixer"`).
     - Indícale leer `.agents/code-review-report.md`, corregir cada hallazgo `OPEN`, actualizar su estado a `FIXED` y ejecutar `pnpm exec nx affected -t typecheck,lint,test`.
4. **Re-verificación (Ronda $N+1$)**:
   - Relanza a **`qa-code-reviewer`** para auditar las correcciones y pasar los ítems de `FIXED` a `VERIFIED` (o reabrirlos a `OPEN` si persisten).
5. **Cierre (máximo 4 rondas)**:
   - El bucle termina cuando `.agents/code-review-report.md` alcance **`Estado Global: APPROVED` (`0 🔴` y `0 🟡` abiertos)** y `nx affected -t typecheck,lint,test` + `nx format:write` estén en verde.
