---
name: jira-plan-proposal
description: Guía para auditar, buscar, proponer y estructurar tickets de Jira (Historias de Usuario y Épicas) dentro de planes de implementación técnica en el Monorepo Nx, respetando criterios de granularidad de UX y confirmación previa del usuario.
---

# Jira Plan Proposal Skill

Utiliza este skill cada vez que planifiques una nueva funcionalidad, módulo, refactorización o flujo de usuario dentro del monorepo el Monorepo Nx (`@jg7/*`, `@shared/*`, `@modules/*`, `@modules/orders/*`).

---

## 1. Regla de Oro: Proponer en el Plan, NO Crear Precipitadamente

1. **Búsqueda Inicial**:
   - Antes de iniciar la planificación técnica o crear ramas, verifica si ya existe un ticket o issue en Jira asignado al requerimiento.
2. **Propuesta Obligatoria en el Plan**:
   - Si no existe un ticket previo, **debes proponer explícitamente el ticket o tickets requeridos dentro del documento `implementation_plan.md`**.
3. **Bloqueo de Creación**:
   - **Queda estrictamente prohibido crear los tickets en Jira antes de que el usuario revise y apruebe el plan de implementación**.
   - Solo tras la confirmación explícita del plan por parte del usuario, se ejecutan las herramientas del MCP `jira-mcp-server` para crear las entidades en Jira.

---

## 2. Criterio de Granularidad Centrado en UX (Cero Tareas Técnicas Aisladas)

- **Basado en Experiencia de Usuario (User Stories)**:
  - Los tickets deben formularse como **Historias de Usuario (HU)** que describan valor tangible y visible para el usuario final o administrador.
  - Formato canónico:
    > **Como** [rol de usuario / administrador / coach]  
    > **Quiero** [funcionalidad o capacidad en la interfaz]  
    > **Para** [beneficio o resultado de negocio esperado]
- **Prohibición de Tareas Técnicas Aisladas**:
  - **NUNCA** dividas tickets por capas técnicas (ej. ❌ "Crear modelo de datos en shared", ❌ "Crear servicio resource", ❌ "Escribir función en backend").
  - Toda la implementación técnica (modelos, servicios, tests, reglas, UI) debe estar contenida dentro de la Historia de Usuario a la que da soporte.
- **Múltiples Tickets**:
  - Se pueden proponer 2 o más HUs solo si la experiencia de usuario o la interacción en pantalla tiene suficiente independencia y valor funcional por sí misma (ej. Captura de Ventas vs Captura de Gastos vs Visualización en Reportes).

---

## 3. Umbral de Épicas (Regla de 3 o más HUs)

- **Si surgen 3 o más Historias de Usuario**:
  - Es **obligatorio proponer la creación de una Épica contenedora** en Jira.
  - La Épica agrupa las HUs del módulo para trazabilidad ejecutiva y de producto.
- **Estructura propuesta en el plan**:

  ```markdown
  ### 📋 Propuesta de Tickets de Jira

  > [!IMPORTANT]
  > Estos tickets se proponen para estructurar el desarrollo y **no se crearán en Jira hasta que confirmes y apruebes este plan**.

  - **Épica Propuesta**: `[PROJ] Nombre Descriptivo de la Épica`
    - **HU 1**: Título de la Historia de Usuario 1 (Rol + Acción + Valor)
    - **HU 2**: Título de la Historia de Usuario 2
    - **HU 3**: Título de la Historia de Usuario 3
  ```

---

## 4. Regla de Fidelidad Absoluta (Cero Resúmenes Destructivos en Jira)

Al crear o actualizar tickets en Jira tras la aprobación del plan:

1. **Preservar 100% del Gherkin**: Queda estrictamente **PROHIBIDO** resumir, truncar o sintetizar los criterios de aceptación. La descripción del ticket debe contener íntegramente todos los escenarios (`Dado / Cuando / Entonces`) tanto para _Happy Path_ como para _No-Happy Path_ (offline, errores HTTP 400, 403, 404, 409, 500).
2. **Desglose Obligatorio en Subtareas Técnicas (Sub-tasks)**: Toda Historia de Usuario que involucre backend y frontend DEBE desglosarse en subtareas hijas en Jira:
   - `[Backend] Cloud Function <nombre-funcion>` (lógica en servidor, serverTimestamp, validación RBAC).
   - `[Frontend] Integración en Service, Engine y UI de <nombre-pantalla>` (llamada httpsCallable, UI reactiva, modales, manejo de errores).
   - `[QA/Tests] Pruebas Unitarias Jest y Validación en Emulador`.
3. **Vínculo al Plan Fuente**: El cuerpo de la Épica DEBE incluir siempre el enlace absoluto al archivo de plan local:
   `* Documento de Especificación: [implementation_plan.md|file:///path/to/implementation_plan.md]`

---

## 5. Trazabilidad Posterior con Git & Branching

Una vez que el usuario aprueba el plan y se crean los tickets en Jira:

1. Toma la clave del ticket principal (o la primera HU del flujo): ej. `PROJ-54`.
2. Crea la rama de git incorporando dicha clave:
   - Formato: `feature/PROJ-54-descripcion-corta`
   - Recuerda usar `git push -u origin <branch-name>` en el primer push.
3. Todo commit subsecuente referenciará la clave en el scope o footer:
   - `feat(PROJ-54): descripción concisa` o con footer `Refs: PROJ-54`.
