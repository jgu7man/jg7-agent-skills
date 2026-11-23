---
name: feature-research
description: Elabora la investigación técnica y de negocio de entrada (Research & Context Document / Spike) para iniciativas en Jira Discovery (DISC). Analiza viabilidad, precedentes en el sistema, arquitectura preliminar, módulos NX y contratos afectados, y riesgos. Se publica o adjunta al ticket de Discovery y sirve como contexto fundacional para el refinamiento técnico.
---

# 🔬 Skill: Documentación de Entrada e Investigación (`/feature-research`)

Utiliza este skill siempre que se proponga una nueva idea, iniciativa o requerimiento complejo que requiera una **fase previa de investigación (Technical & Business Research Spike)** antes de ser refinada como Historia de Usuario.

---

## 🎯 1. Propósito y Valor en el Ciclo de Vida

La **Documentación de Entrada (Research Spike)** no es una especificación cerrada ni una historia de usuario:
* **Misión**: Reducir la incertidumbre técnica y de negocio antes de estimar o refinar. Proporciona el **contexto arquitectónico real** del sistema para que el equipo no diseñe sobre suposiciones.
* **Consumidores**:
  1. **Tablero Jira Discovery (`DISC`)**: Se adjunta o vincula como evidencia de respaldo para sustentar el *Reach*, *Impact* y calibrar la *Confidence*.
  2. **Refinamiento Técnico (`jira-story-structure`)**: Sirve de insumo directo para redactar los contratos de datos, diagramas ASCII y planes de implementación sin partir de cero.
  3. **Desarrolladores**: Contexto vivo sobre módulos tocados, APIs externas y riesgos de deuda técnica.

---

## 📐 2. Plantilla Canónica del Documento de Investigación

Todo entregable de investigación debe estructurarse con las siguientes 6 secciones bajo el estándar corporativo:

```markdown
# 🔬 Documento de Investigación: [Título de la Iniciativa]
> **Iniciativa / Idea**: `[DISC-XXX o Nombre]`  
> **Área / Módulo**: `[Ej. Facturación / Ledger / Auth / Checkout]`  
> **Fecha & Autor**: `[Fecha] — Jorge Guzmán & Antigravity`  
> **Estado de Viabilidad**: `[VIABLE | VIABLE_CON_RESERVAS | NO_VIABLE]`

---

## 1. Planteamiento del Problema & Oportunidad de Negocio
- ¿Cuál es la fricción real, cuello de botella o necesidad no cubierta?
- ¿A qué roles de usuario impacta directamente?
- ¿Qué pasa hoy si no se implementa nada?

---

## 2. Precedentes en el Sistema & Estado del Arte (Benchmarking Interno/Externo)
- **Soluciones similares existentes en la suite**: ¿Existen módulos en PROJ, MPS o AcademyModule que resuelvan algo análogo? (Evitar reinventar la rueda).
- **Herramientas o servicios externos**: APIs evaluadas (Stripe, Firebase, Webhooks bancarios, etc.), costos o limitaciones operativas conocidas.
- **Lecciones aprendidas**: Fallas o limitaciones que se hayan presentado en versiones previas de características similares.

---

## 3. Mapeo de Arquitectura y Módulos Afectados (Nx Monorepo)
Identificación previa de librerías, aplicaciones y servicios que requerirán cambios:
- **Librerías de Dominio / Contratos**: `libs/shared/models/...`, `libs/.../domain`
- **Servicios de Backend / Cloud Functions**: `functions/src/...`, triggers de Firestore.
- **Frontend / Componentes UI**: `apps/.../src/app/...`
- **Colecciones de Firestore estimadas**:
  - `tenants/{tenantId}/[coleccion_a]`
  - `tenants/{tenantId}/[coleccion_b]`

---

## 4. Matriz de Viabilidad, Factibilidad y Deuda Técnica Previa (Pre-CAT)
- **Dependencias Críticas**: ¿Qué debe existir antes de poder construir esto?
- **Puntos de Falla y Riesgos Operativos**: ¿Hay riesgo de descuadre contable, concurrencia o saturación de lecturas/escrituras en Firestore?
- **Deuda Técnica Preexistente Detectada**: Archivos o contratos en la zona de impacto que requieren saneamiento preventivo bajo el Protocolo CAT antes de implementar.

---

## 5. Propuesta de Arquitectura Preliminar & Estrategia Técnica
- Diagrama Conceptual en Plain Text (ASCII):
```text
[ Entrada / Trigger ] ──► [ Validación de Reglas ] ──► [ Persistencia ] ──► [ Efectos Secundarios ]
```
- Estrategia de migración de datos o compatibilidad retroactiva (si aplica).

---

## 6. Recomendaciones para el Refinamiento y Próximos Pasos
- ¿Qué preguntas abiertas de negocio quedan por responder con los stakeholders?
- Propuesta de partición en Historias de Usuario (HU) o Tareas Técnicas.
- Sugerencia de puntajes RICE para el tablero Discovery:
  - *Reach*: [1.0 - 5.0]
  - *Impact*: [1.0 - 5.0]
  - *Confidence*: [50% - 100%]
  - *Effort*: [1.0 - 5.0]
```

---

## 🚀 3. Protocolo de Publicación y Vinculación con Jira Discovery (Polaris)

Una vez generada la investigación con Antigravity:

1. **Creación / Actualización en Jira Product Discovery (`DISC`)**:
   - **Regla de Título Corto y Administrable (`summary`)**: El título de la Idea en `DISC` debe ser **conciso, directo y administrable desde vistas de tabla/panel (30 a 50 caracteres máximo)**. Prohibido usar prefijos entre corchetes o enumerar múltiples componentes técnicos en el título (ej. ✅ `"Privacidad, Consentimiento y Derechos ARCO"`, ❌ `"[Afiliación Sheló & Privacidad] Consentimiento Legal Bilateral Versionado, Validador CURP..."`).
   - **Regla de Listas Numeradas y Formato en Descripción (`description`)**:
     - **Salto de línea corto en listas numeradas**: Al redactar listas numeradas (`1.`, `2.`, `3.`), cada ítem debe ir en líneas consecutivas simples (**salto de línea corto `\n`**, sin líneas en blanco `\n\n` ni sub-bullets indentados con `-` entre ítems). Un salto de línea largo o sub-bullet rompe la lista en Jira Wiki Markup (`#`) y aplana todos los números a `1.`.
     - **Cero backticks dentro de negritas**: Nunca anidar `` `código` `` dentro de `**negritas**` (`**Texto (`código`)**`); colocar siempre el código fuera de los asteriscos (`**Texto** (` + `` `código` `` + `)`) para que Jira convierta correctamente a `{{código}}`.
2. **Registro de Investigaciones y Archivos Base como Datos Relevantes (Polaris Insights)**:
   - Toda investigación (Spike), especificación de dominio o plantilla documental base publicada en Confluence Cloud debe registrarse como **Dato Relevante (Polaris Insight)** en la pestaña **"Datos relevantes"** del ticket `DISC` (además del enlace remoto con `jira_create_remote_issue_link`).
   - En la API GraphQL de Atlassian Polaris (`/gateway/api/graphql` o `https://api-private.atlassian.com/graphql` con header `"X-ExperimentalApi": "polaris-v0"`), los *Insights* se crean mediante la mutación `createPolarisInsight(input: CreatePolarisInsightInput!)` asociando el `cloudID`, `projectID`, `issueID`, `description` (ADF) y los `snippets` con la URL del documento de Confluence.
3. **Publicación en Confluence Cloud (Estándar OKF2)**:
   - Publicar los documentos base y de arquitectura bajo el espacio correspondiente (`MI`, `DOCS`, etc.) usando el skill `confluence-authoring`.
   - En el bloque de metadatos OKF2 al inicio de la página, usar una lista compacta o salto de línea simple sin párrafos espaciados excesivos, y mantener un solo formato de diagrama limpio por sección.
4. **Pase a Refinamiento**:
   - Indicar explícitamente al usuario que la investigación está lista para alimentar `/feature-refine` (`jira-story-structure`).

---

## 📚 4. Referencias y Contexto del Monorepo (Progressive Disclosure)

Para asegurar coherencia con el dominio de negocio de JG7, consulta bajo demanda:

* **[Glosario Maestro y Lenguaje Ubicuo](./glosario-ubicuo.md)**: Nomenclatura oficial de actores (`Payer`, `Subscriber`), finanzas (`Ledger`, `Transaction`) y estados canónicos.
* **[Seguridad y Matriz Multi-Tenant](./multi-tenant-matrix.md)**: Convención de aislamiento de colecciones `tenants/{tenantId}/` y roles de acceso.
* **[Arquitectura de Features Shared](./shared-features.md)**: Directrices para que los componentes y contratos sean reutilizables entre verticales (CoreProduct, AcademyModule, Miss Pedidos).
* **[Taxonomía de Contratos](./taxonomy-contracts.md)**: Estándar para modelar DTOs y eventos de dominio sin duplicación.
