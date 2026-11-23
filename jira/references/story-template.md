---
name: jira-story-structure
description: Estándar corporativo obligatorio para redactar y estructurar Historias de Usuario (HU) y tickets técnicos en Jira Cloud para Business Valley y sus suites (PFGO, MPS). Define la plantilla de 5 secciones en Markdown nativo de Jira Cloud, análisis técnico, plain-text diagrams, criterios Gherkin y planes de implementación por fases.
---

# 📋 Jira Story Structure Standard (`jira-story-structure`)

Utiliza este skill siempre que redactes o crees una **Historia de Usuario (HU), Bug/Hotfix o Tarea Técnica en Jira Cloud** para los proyectos de Marxa Digital (PFGO, MPS, etc.).

---

## 🎯 1. Principio Fundamental de Redacción en Jira Cloud

- **Formato Markdown Nativo**: Jira Cloud utiliza GitHub Flavored Markdown (GFM) / Atlassian Document Format (ADF).
  - Encabezados: Utilizar `##` para Secciones Principales y `###` para Subsecciones (NUNCA usar la sintaxis obsoleta de Jira Server `h2.` o `h3.`).
  - Separadores: Utilizar `---`.
  - Enlaces: Utilizar `[Texto del Enlace](https://...)` (NUNCA `[Texto|url]`).
  - Tablas: Utilizar sintaxis estándar de tablas Markdown (`| Encabezado |` y `| :--- |`).
  - Bloques de Código y Diagramas: Utilizar triple comilla invertida `text ... ` o `bash ... ` (NUNCA `{noformat}` o `{code}`).
- **Compatibilidad de Renderizado**: El editor de Jira Cloud **NO soporta bloques de código Mermaid**. Queda estrictamente prohibido incrustar `mermaid ` en tickets de Jira.
- **Diagramas**: Utilizar diagramas en **Plain Text / ASCII** dentro de bloques `text ` para representar flujos e interacción entre servicios. Si se requiere visualización interactiva rica, remitir mediante enlace a la página correspondiente en Confluence.
- **Criterios de Aceptación (Gherkin de 3 Bullets con Saltos Inline / Shift+Enter)**:
  - Los criterios de aceptación **NO son bloques de código**.
  - **Regla de 3 Bullets**: Cada escenario debe contener **únicamente 3 viñetas principales (bullets)**:
    1. `* **Dado** ...`
    2. `* **Cuando** ...`
    3. `* **Entonces** ...`
  - Las cláusulas complementarias **`Y`** deben ser **saltos de línea internos dentro de la misma viñeta (inline breaks / `\n  Y ...` / Shift+Enter)**, **NUNCA** viñetas separadas.
- **Formato Monoespaciado (Inline Code)**:
  - Toda ruta de archivo (`libs/...`, `functions/...`), path de base de datos (`tenants/{tenantId}/...`), nombre de interfaz/modelo (`PurchaseOrderItem`), método (`cancelOrderItem()`), variable (`totalPaid`), enum/estado (`CANCELADO`) o valor de código **DEBE llevar formato monoespaciado** con backticks (`` `código` ``).

---

## 📐 2. Plantilla Canónica de 5 Secciones para Jira Cloud

Toda issue debe estructurarse con las siguientes 5 secciones obligatorias en Markdown limpio:

````markdown
## 📋 Descripción

[Resumen claro del problema o necesidad del usuario/negocio, impacto operativo y justificación de la solución.]

🔗 **Documentación Funcional en Confluence:**

- [Título de la Página](https://marxa-digital.atlassian.net/wiki/spaces/.../pages/...)

---

## 🔬 Análisis Técnico

### Modelos y Contratos de Datos

| Entidad   | Ruta en Firestore                        | Campos Críticos Afectados                               |
| :-------- | :--------------------------------------- | :------------------------------------------------------ |
| `ModeloA` | `tenants/{tenantId}/coleccion/{id}`      | • `campo1`: descripción<br>• `campo2`: cambio de estado |
| `ModeloB` | `tenants/{tenantId}/otra_coleccion/{id}` | • `campo_ref`: referencia cruzada                       |

### Diagrama de Flujo y Causa Raíz

```text
[ Actor / Componente UI ]
        │
        ▼ (Acción)
[ Modal de Confirmación ]
        │
        ├── ¿Condición A? ──► [ Servicio A ] ──► Colección 1
        └── ¿Condición B? ──► [ Servicio B ] ──► Colección 2
```
````

### 🧹 Auditoría Scout y Refactorización de Antipatrones (Boy Scout Rule)

- **Código Reutilizable Existente:** Utilidades identificadas en `@mx-valley/util` y modelos en `@mx-<suite>/models`.
- **Antipatrones Detectados en Archivos a Intervenir:** Erradicación de `any`, adición de `(keyup.enter)` en `(click)`, `@let` en plantillas, eliminación de lógica duplicada.
- **Estrategia de Desacoplamiento:** Prevención de crecimiento en componentes/helpers monolíticos (> 500 líneas) mediante extracción atómica.

---

## ✅ Criterios de Aceptación

**Escenario 1: [Nombre descriptivo del escenario principal]**

- **Dado** [condición inicial o estado previo del sistema]
  _Y_ [precondición secundaria de permisos o configuración]
- **Cuando** [el usuario ejecuta la acción]
  _Y_ [captura o confirma datos requeridos]
- **Entonces** [efecto inmediato en la interfaz o respuesta]
  _Y_ [efectos secundarios en base de datos, ledger o balances]

**Escenario 2: [Escenario de excepción o validación de bloqueo]**

- **Dado** [estado donde no se permite la acción]
- **Cuando** [el usuario intenta ejecutar la acción]
- **Entonces** [el sistema bloquea la acción con mensaje amigable sin escrituras en DB]

---

## 🛠️ Plan de Implementación

### Fase 1: Capa de Dominio y Modelos

- Modificaciones de contratos en `*.model.ts`, enums y tipos.

### Fase 2: Lógica de Negocio y Orquestación Contable

- Métodos en servicios de infraestructura o motores desacoplados (`*ResourceService`, `*Engine`).

### Fase 3: Componentes e Interfaz de Usuario

- Creación de componentes/modales, conexión de eventos y experiencia visual.

---

## 📂 Archivos a Modificar

- `ruta/al/archivo/modelo.ts`
- `ruta/al/archivo/servicio.service.ts`
- `ruta/al/archivo/componente.component.ts` (NEW)

`````

---

## 🚀 3. Protocolo de Ejecución con Jira API (Jira Cloud)

Cuando prepares una issue para ser creada o actualizada vía script REST de Jira Cloud:

1. **Usar Markdown Estándar**: Enviar Markdown nativo (`##`, `###`, `---`, `[link](url)`, tablas con `| :--- |`, bloques de código con ````text ````).
2. **Evitar sintaxis legacy de Jira Server**: No usar `h2.`, `h3.`, `{noformat}`, `|| col ||`, ni `[texto|url]`.
3. **Validar que la issue quede asociada al proyecto respectivo** (`PFGO` o `MPS`).
`````
