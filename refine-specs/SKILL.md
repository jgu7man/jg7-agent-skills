---
name: refine-specs
description: >-
  Guía sesiones exhaustivas de refinamiento técnico-funcional y planeación de negocio
  (sin SDD burocrático). Busca a fondo en el monorepo antes de proponer, consulta al
  desarrollador antes de crear piezas nuevas, detecta redundancias o código defensivo/dummy
  y diseña pruebas orientadas a valor en business-specs.md. Activar cuando el usuario pida
  refinar un módulo o plan, revisar reglas de negocio, auditar specs o evitar código dummy.
---

# Refinamiento de Plan, Negocio y Specs (`refine-specs`)

Skill de refinamiento conversacional riguroso. Su objetivo es alinear diseño, contratos, UI y pruebas con las reglas reales del negocio **aprovechando lo que ya existe en el repositorio** y **preguntando antes de asumir creaciones nuevas**.

---

## Principios Innegociables

1. **Buscar a fondo antes de hablar:** Nunca proponer ni crear un archivo, enum, interface, pipe, token o componente sin haber buscado primero en `libs/` y `apps/` qué piezas ya existen.
2. **Consultar antes de crear (Cero Asunciones):** Si parece faltar una abstracción, preguntar primero al desarrollador si ya existe bajo otro nombre, si prefiere extender una existente o si autoriza crearla. El desarrollador suele conocer piezas que la búsqueda inicial no reveló.
3. **Cero código defensivo, dummy o redundante:** Cuestionar todo wrapper de una línea, parámetro `raw`, token estático desconectado de la DB o fallback silencioso que oculte un contrato roto.
4. **Specs desde el negocio, no desde el código:** Toda prueba unitaria (`*.spec.ts`) debe redactarse como garantía de negocio o experiencia de usuario, mantener independencia total por archivo y quedar inventariada en `business-specs.md`.

---

## Protocolo de Refinamiento en 5 Fases

### Fase 1: Discovery Exhaustivo del Repositorio
Antes de opinar o escribir código, ejecutar el checklist completo de [Checklist de Discovery y Cero Asunciones](./references/discovery-checklist.md):
- Inventariar modelos (`*.model.ts`), schemas (`*.schemas.ts`), tokens (`*.tokens.ts`), pipes/directivas compartidas y configuración en Firestore (`apps/{appId}`).
- Revisar los `business-specs.md` existentes en las librerías afectadas.

### Fase 2: Entrevista de Cero Asunciones
Si existen dudas sobre alcance, ubicación de un modelo, reutilización de una pieza existente o si un comportamiento es regla de negocio vs detalle técnico:
- **Detenerse y preguntar** (usando preguntas concretas con opciones claras) antes de inventar nombres, rutas o contratos nuevos.
- Confirmar explícitamente si se desea crear un archivo/abstracción nueva o reutilizar/extender una existente.

### Fase 3: Auditoría de Redundancias y Código Defensivo/Dummy
Contrastar la implementación o plan contra estos focos rojos (ver [Ejemplos Antes/Después](./examples/refinement-before-after.md)):
- **Modelos puros (`domain`) vs Acceso a datos (`data-access`):** Separar los modelos/contratos puros (`libs/<dominio>/domain`) de los servicios de Firestore/API (`libs/<dominio>/data-access`), de modo que futuras APIs o Cloud Functions puedan consumir `domain` sin arrastrar métodos ni dependencias de frontend.
- **Enums/Contratos duplicados:** Un tab o componente UI definiendo su propio enum cuando ya existe el enum de dominio en `models/`.
- **Wrappers y parámetros `raw`:** Funciones `parse*WithZod(id, raw)` que solo envuelven `schema.parse({ ...data, id })`, o `raw: Record<string, unknown>` cuando Zod ya valida `unknown`.
- **Identificadores canónicos:** Tomar siempre el `id` de su fuente real (ej. `snapshot.id` de Firestore), nunca depender de que venga duplicado en el cuerpo del documento.
- **Configuración por `InjectionToken` (Cero Ternarios por App en Shared):** Prohibido usar ternarios/condicionales por `appId` o vertical dentro de librerías compartidas para generar defaults (`appId === 'backoffice' ? ... : ...`). Cada app debe inyectar sus valores iniciales vía `InjectionToken` (`provideAppRegistryDefaults`, `provideAuthEngine`).
- **Configuración en DB desconectada:** Servicios que hidratan `apps/{appId}` en un signal mientras guards, servicios o UI siguen leyendo el token estático de arranque.
- **Templates pesados:** Bloques `@else` o lógica repetida de clases activas que corresponden a un subcomponente presentacional, token de diseño o pipe compartido.

### Fase 4: Proyección de `business-specs.md` y Apoyo Visual (`/illustrations`)
Diseñar o auditar el inventario de pruebas siguiendo [Guía de Business Specs](./references/business-specs-guide.md):
- Evaluar qué specs actuales son genéricos/pasamanos y cuáles protegen reglas de negocio reales.
- Redactar cada `it('should ...')` orientado a negocio/usuario, manteniendo **independencia unitaria** entre archivos `.spec.ts`.
- Documentar o actualizar `business-specs.md` en la raíz de cada librería intervenida.
- **Representación visual:** Cuando una propuesta de flujo, arquitectura, estado o contraste Antes/Después gane claridad visualmente, activar el skill `/illustrations` (`~/.gemini/config/skills/illustrations/SKILL.md`) para generar bocetos explicativos o *shot lists* en lugar de depender solo de bloques de texto densos.

### Fase 5: Cierre, Cross-Check con Quality Gates y Verificación
- Contrastar los cambios aprobados con **`code-review`** (el hub de Code Review y Protocolo CAT) y **`sanitize-architecture`** (saneamiento de modelos, cero `*Like` y `Test Smell -> Architecture Fix`).
- Ejecutar typecheck (`tsc --noEmit`) y pruebas unitarias sin watch (`--watch=false --browsers=ChromeHeadless`) tras los cambios aprobados.
- Reportar únicamente archivos, símbolos y resultados observados tras la última edición.
