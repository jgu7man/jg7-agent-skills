---
name: feature-execute
description: "Skill de toma y ejecución autónoma de Historias de Usuario, Lotes de Tickets o Épicas completas refinadas ('Ready for Dev') orquestando subagentes de desarrollo continuo: Arquitecto (tech-plan), Coder (implementación + Zod en DB), Revisor QA (qa-code-reviewer + Quality Gates) y Validador Funcional (Navegador UI / Bruno para Cloud Functions). Se activa con 'Antigravity, toma el ticket/épica [KEY]' o '/feature-execute [KEYS]'."
---

# ⚡ Skill: Ejecución Autónoma de Tickets y Épicas (`/feature-execute`)

Utiliza este skill siempre que vayas a **tomar una o varias Historias de Usuario, Tareas Técnicas o una Épica completa previamente refinada** para ejecutar su desarrollo de principio a fin coordinando la cadena de subagentes especializados.

---

## 🎯 1. Modos de Activación y Sintaxis

### Modo A: Ticket Individual

- `Antigravity, toma el ticket MPS-1042`
- `/feature-execute MPS-1042`

### Modo B: Lote de Múltiples Tickets (Batch)

- `Antigravity, toma los tickets MPS-1042, MPS-1043 y MPS-1044`
- `/feature-execute MPS-1042, MPS-1043, MPS-1044`

### Modo C: Épica Completa

- `Antigravity, toma la épica MPS-1000`
- `/feature-execute MPS-1000`

---

## 🧭 2. Cadena de Subagentes por Ticket

Para cada ticket (o lote coherente del mismo `scope`), el Orquestador ejecuta esta secuencia estricta:

```text
[ 1. Contexto Jira & Rama Git ] ──► [ 2. Arquitecto: tech-plan ]
                                                     │
                                                     ▼
[ 4. QA Review: qa-code-reviewer ] ◄── [ 3. Coder: Implementación + Zod + Tests ]
               │
               ▼
[ 5. Validación Funcional: Browser UI / Bruno CFs ] ──► [ 6. Cierre & Liberación de Puertos ]
```

### Paso 1: Lectura de Jira y Seguridad de Rama Git (Orquestador)

- Consultar ticket con `mxd_get_issue` o `jira_get_issue` para extraer Gherkin, contratos y contexto.
- Verificar `git status` y asegurarse de no estar en `main` ni `develop`.
- Crear rama temporal `feature/<issue-key>-<slug>` y transicionar el ticket a `In Progress`.

### Paso 2: Definición Técnica / Plan de Implementación (Arquitecto)

- Aplicar [tech-plan](file:///Users/jgu7man/.gemini/config/skills/tech-plan/SKILL.md) para definir el plano de bajo nivel antes de tocar código:
  - **Librerías por `scope` + `type`**: `marxa-digital/[scope]`, `shared/{type}/[scope]`, `modules/[scope]/{api,feature,data-access,domain,ui,utils}`, `functions/[scope]`.
  - **Contratos y Schemas Zod (`domain`)**: `*.model.ts` (con string enums) + `*.schema.ts` (con `z.nativeEnum(...)`) para todo documento que se guarde o lea en DB.
  - **Frontera de Persistencia (`data-access` / `functions`)**: dónde se aplica `Schema.parse()` al guardar y `safeParse()` + `BoundaryTransformer` al leer datos legados.
  - **Topología UI y Tests**: separación `*Engine.ts` vs componentes `OnPush` (`< 250` líneas HTML) y lista de `*.spec.ts` + casos de navegador o Bruno.

### Paso 3: Codificación y Pruebas Unitarias (Subagente Coder)

- El Coder ejecuta el Plan de Implementación aplicando el Protocolo CAT en los archivos impactados:
  - Archivos nuevos en `kebab-case.ts`.
  - Cero `any`, cero interfaces `*Like`, cero wrappers de 1 línea, cero boolean leakage.
  - Si el ticket requiere cambios en `firestore.rules`, delegar a **`firestore-rules-author`**.
  - Implementar pruebas unitarias `*.spec.ts` orientadas a negocio y validación de schemas Zod.

### Paso 4: Bucle Iterativo de Code Review y Quality Gates (`qa-code-reviewer ⇄ Coder`)

1. **Ronda $N$ de Auditoría**: Invocar a **`qa-code-reviewer`** sobre el `git diff` de la rama y persistir todos los hallazgos en **`.agents/code-review-report.md`** con su `ID`, `Severidad` (🔴 Bloqueante / 🟡 Deuda Técnica / 🟢 Scout), `Archivo:Línea`, `Acción Requerida` y estado `OPEN`.
2. **Bucle de Reparación Automática (hasta 4 rondas)**:
   - Mientras existan hallazgos 🔴 o 🟡 en estado `OPEN` (o falle `pnpm exec nx affected -t typecheck,lint,test --coverage`):
     - Enviar mensaje con **`send_message`** al mismo `conversationId` del subagente **Coder**: _"Lee `.agents/code-review-report.md` (Ronda N), repara todos los ítems `OPEN` (🔴 y 🟡), márcalos como `FIXED` y valida con `nx affected -t typecheck,lint,test`"_.
     - Cuando el Coder responda, relanzar a **`qa-code-reviewer`** (Ronda $N+1$) para verificar que los puntos `FIXED` pasen a `VERIFIED` y no se hayan introducido regresiones.
3. **Condición de Salida**: Solo cuando `.agents/code-review-report.md` esté en `APPROVED` (`0 🔴` y `0 🟡` abiertos) y `pnpm exec nx affected -t typecheck,lint,test` + `nx format:write` pasen en verde, se avanza al Paso 5.

### Paso 5: Validación Funcional en Emuladores (UI y/o Bruno)

- **Si el ticket toca Frontend (`feature` / `ui` / `data-access`)**:
  - Invocar el flujo de `qa-reviewing` (`qa-emulator-operator` + `qa-regression-tester` / `browser`) para validar criterios Gherkin y cálculos en pantalla.
- **Si el ticket toca Cloud Functions (`functions/[scope]`)**:
  - Ejecutar [bruno-qa](file:///Users/jgu7man/.gemini/config/skills/bruno-qa/SKILL.md) (`qa-emulator-operator` + `npx @usebruno/cli run [scope] --env emulator`) verificando Happy Path `200`, rechazo de payloads corruptos por Zod `400`, seguridad `401/403` y efectos en Firestore.
- **Teardown obligatorio**: Confirmar que `qa-emulator-operator` desocupe todos los puertos locales antes de finalizar.

---

## 🅱️ 3. Estrategia para Lotes y Épicas

- **Múltiples Tickets del Mismo `scope`**: Integrar en una rama compartida, diseñar un único Plan de Implementación consolidado y pasar la cadena completa de QA.
- **Tickets de `scope` Independientes**: Procesar secuencialmente o delegar en paralelo mediante `invoke_subagent` con `Workspace: "branch"`, asegurando que cada rama pase `qa-code-reviewer` y sus gates antes de integrarse.
- **Épicas**: Descubrir historias hijas (`Ready for Dev`), ordenarlas por dependencia natural (`1. domain (models + schemas Zod)` $\rightarrow$ `2. data-access & functions/[scope]` $\rightarrow$ `3. ui & feature`) y ejecutar el ciclo por cada historia.
