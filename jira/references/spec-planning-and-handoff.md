---
name: mxd-spec-planning-and-handoff
description: Playbook y estándar obligatorio para refinamiento guiado (/grill-me), especificación técnica con Gherkin completo, matriz de capas (CFs vs Frontend), creación fidedigna de tickets en Jira con Subtareas y Handoff de ejecución con cero pérdida de contexto.
---

# MXD Spec Planning & Jira Handoff Skill

Utiliza este skill cuando el usuario desee planificar, diseñar o estructurar una nueva funcionalidad, módulo, Épica o refactorización de negocio en Business Valley.

---

## 1. Ciclo de Vida de Planificación (4 Fases Obligatorias)

```mermaid
flowchart LR
    A["1. Refinamiento (/grill-me)"] --> B["2. Matriz de 4 Capas + Gherkin"]
    B --> C["3. Sincronización Jira con Subtareas"]
    C --> D["4. Handoff de Ejecución Fidedigno"]
```

### Fase 1: Refinamiento Guiado con el Usuario

- Realizar preguntas clave antes de asumir código:
  1. ¿Qué operaciones deben ocurrir obligatoriamente en backend (Cloud Functions) vs frontend?
  2. ¿Qué estados o catálogos se ven involucrados? (Definir string enums).
  3. ¿Cuáles son los escenarios de error, concurrencia (409) o permisos denegados (403)?
  4. ¿Qué datos semilla se requieren para emulador local?
  5. **Modularidad Nx & Thin Apps:** ¿Cómo se estructurará la feature bajo `libs/modules/<feature>/` (`contracts` puro para frontend/backend, `feature` para UI Angular, `api` para Cloud Functions)? Queda estrictamente prohibido colocar vistas o lógica dentro de `apps/`.

### Fase 2: Redacción del `implementation_plan.md`

- Estructurar el plan con:
  - **Escenarios Gherkin Completos**: Dado / Cuando / Entonces tanto para Happy Path como para No-Happy Path (offline, errores HTTP, validación de tokens).
  - **Modularidad Nx Declarada**: Mapeo estricto de librerías en `libs/modules/<feature>/` (`contracts` sin dependencias de Angular, `feature` para componentes).
  - **Matriz de 4 Capas**:
    1. _Modelos & Enums_ (`contracts` o `@mx-valley/models`).
    2. _Cloud Functions Node.js_ (`api` o functions callables/triggers/schedulers).
    3. _Frontend Angular_ (`feature` con Thin Views, Headless Engines, Resource Services).
    4. _QA & Validación_ (Jest Specs, Emuladores, Navegador con Chrome DevTools).

### Fase 3: Sincronización Fidedigna en Jira (Cero Resúmenes Destructivos)

- **Épica**: Incluir descripción estratégica y el enlace absoluto al archivo `implementation_plan.md`.
- **Historias de Usuario (HUs)**:
  - Preservar íntegramente los escenarios Gherkin sin resumir en la descripción del ticket.
- **Subtareas Técnicas (Sub-tasks)**:
  - Desglosar obligatoriamente cada HU en subtareas hijas:
    - `[Backend] Cloud Function <nombre-funcion>`
    - `[Frontend] Integración en Engine y UI de <nombre-pantalla>`
    - `[QA] Pruebas Unitarias Jest y Validación en Emulador`

### Fase 4: Handoff de Ejecución

- Toda instrucción de ejecución entre agentes o sesiones debe referenciar la ruta al `implementation_plan.md` original para garantizar continuidad absoluta.
