---
name: confluence-authoring
description: Guía, estándares y mejores prácticas para crear, estructurar y actualizar páginas en Confluence Cloud vía MCP jira-mcp-server (confluence_create_page, confluence_update_page) bajo el estándar OKF2, gestión limpia de títulos/emojis y formato de almacenamiento.
---

# Confluence Authoring & Publishing Skill

Utiliza este skill siempre que necesites **crear, documentar, actualizar o estructurar páginas** dentro de Confluence Cloud para proyectos y suites de JG7.

---

## 1. Reglas Críticas de Emojis e Íconos de Página

En la API de Atlassian Confluence Cloud (`jira-mcp-server`), el parámetro `emoji` define el **Ícono de Página** nativo (el glifo mostrado en el encabezado y en el árbol de navegación lateral).

### A. Títulos Limpios (Sin Duplicados)
El campo `title` **NUNCA** debe incluir el emoji como texto al inicio cuando se usa el atributo `emoji`.
* ❌ **INCORRECTO:** `emoji: "⚡"`, `title: "⚡ Backend: Cloud Functions"` ➡️ Confluence renderiza: `⚡ ⚡ Backend: Cloud Functions`.
* ✅ **CORRECTO:** `emoji: "⚡"`, `title: "Backend: Cloud Functions"` ➡️ Confluence renderiza: `⚡ Backend: Cloud Functions`.

### B. Compatibilidad de Glifos Unicode (Evitar Íconos Fantasma / Invisibles)
Confluence Cloud utiliza un set de íconos estandarizado (Twemoji / single codepoints). Emojis con **Variation Selector 16 (`\uFE0F` / sufijo `-fe0f`)** o glifos complejos (como `🏗️`, `🗄️`, `⚙️`, `🛠️`) no tienen mapeo SVG en el frontend de Atlassian y se renderizan como **cajas vacías**. Usar siempre emojis seguros de un solo punto de código (`🏢`, `💾`, `🔀`, `👥`, `⚡`, `📁`, `🔄`, `💰`, `🔑`, `📊`, `💳`, `📋`).

---

### Regla 5: Diagramas de Arquitectura y Flujos (Just Add+ & Mermaid)
> [!TIP]
> **ESTÁNDAR OFICIAL DE DIAGRAMAS EN CONFLUENCE (JG7)**:
> La organización cuenta con la app **Just Add+** instalada en Confluence Cloud (`JG7.atlassian.net`).
> 
> **Cómo insertar diagramas:**
> 1. **Vía Interfaz de Usuario (Editor Confluence - Recomendado):**
>    - Escribe `/diagram` en el editor y selecciona **Diagram (Just Add+)**.
>    - En el selector *Choose the syntax to use*, elige **Mermaid** (o *PlantUML*, *Graphviz*, *BlockDiag*).
>    - En la pestaña **Type your own**, pega directamente el código Mermaid (`sequenceDiagram`, `flowchart TD`, etc.).
>    - El macro renderiza interactivamente el diagrama vectorial con soporte para zoom y modo oscuro automático.
> 
> 2. **Vía API / Creación Programática con MCP:**
>    - ⚠️ **Limitación de API**: Confluence Cloud no permite a la API REST instanciar o invocar dinámicamente macros de terceros de Connect/Forge (como Just Add+ o Mermaid plugins) mediante bloques ` ```mermaid ` simples (provoca que el bloque se borre o muestre "Error al cargar extensión").
>    - **Regla para el Agente**: Cuando crees o actualices páginas vía MCP que requieran diagramas Mermaid, **debes incluir el código Mermaid completo dentro de un bloque de código legible (` ```text ` o bloque de código)** con una instrucción clara para que el usuario o editor solo tenga que copiar el contenido y pegarlo en la macro `/diagram (Just Add+)`.
> 
> 3. **Diagramas Temporales / Cronogramas:**
>    - Para Gantt / Roadmaps de hitos temporales interactivos, se puede utilizar tanto Mermaid (`gantt`) como la macro nativa **`Roadmap Planner`** (`<ac:structured-macro ac:name="roadmap">`) mediante el skill `confluence-roadmap-planner`.
> 
> 4. **Diagramas Rápidos en Texto / ASCII:**
>    - Para esquemas atómicos en tablas o llamadas inline, los bloques `text` con Unicode Box Drawing (`┌─┐`, `│`, `└─┘`, `──▶`) siguen siendo válidos como fallback ligero.

---

## 2. Tipología de Documentación: Funcional vs. Investigación

Es fundamental clasificar el propósito del documento antes de redactar su estructura y tono:

### A. Documentación Funcional (Sistemas, Módulos y Features en Producción)
* **Propósito**: Explicar con claridad meridiana y practicidad **CÓMO FUNCIONA la maquinaria del sistema** para que cualquier desarrollador o miembro del equipo entienda de inmediato el comportamiento del software.
* **Enfoque obligatorio**:
  * **Qué** hace el sistema, **Cómo** lo hace (maquinaria, flujo de datos, servicios) y **Dónde** (rutas Firestore, tablas, componentes).
  * **Cero narrativas temporales**: **NO** hablar de "antes y después", ni redactar bitácoras de "planes a realizar" o "intenciones futuras", a menos que sea un ADR formal o RFC.
  * Debe incluir **diagramas visuales de interacción** (Mermaid `sequenceDiagram` o `flowchart`), contratos de datos reales y matrices de comportamiento por caso de uso.
  * Todo desarrollador debe poder abrir el documento y deducir exactamente qué servicios interactúan, qué tablas/colecciones se modifican y qué efectos secundarios ocurren.

### B. Documentación de Investigación (Spikes, Auditorías, Benchmarks, RFCs)
* **Propósito**: Explorar alternativas, analizar problemas de fondo, evaluar librerías o comparar el estado actual vs. propuestas técnicas.
* **Enfoque**:
  * Aquí **SÍ** se permiten y requieren comparativas ("Enfoque A vs. Enfoque B"), análisis de brechas ("Estado Actual vs. PRD") y planes de migración o experimentación.

---

## 3. Prácticas Clave para Documentación Funcional Efectiva

1. **Diagramas de Secuencia y Maquinaria**: Incluir diagramas Mermaid que muestren la orquestación entre la UI, los Servicios de Dominio, la Capa Contable (Ledger) y la Base de Datos.
2. **Tablas de Contratos de Datos**: Detallar qué colecciones/tablas se leen o escriben y qué campos críticos cambian de estado.
3. **Matrices de Casos de Negocio**: Exponer en tablas claras qué ocurre bajo cada escenario operativo (ej. pagos parciales vs. liquidados vs. sin pago).

---

## 4. Parámetros Estándar en MCP (`confluence_create_page` / `confluence_update_page`)

```typescript
{
  space_key: "DOCS",                   // Clave del espacio destino
  parent_id: "390529237",              // ID de la página padre para mantener jerarquía
  title: "Nombre Limpio de la Página", // Texto plano sin emoji al inicio
  emoji: "🚀",                         // Ícono de página seguro
  page_width: "default",               // "default" o "full-width"
  content_format: "storage",           // Preferir "storage" (XHTML) cuando haya bloques de código con regex (\d, \w) o diagramas
  content_file: "/ruta/absoluta.xhtml" // Preferir content_file para documentos completos
}
```

> [!IMPORTANT]
> **Prevención de Bloques de Código Rotos (Líneas de Código Independientes)**:
> En `jira-mcp-server` (`mcp-atlassian`), cuando se usa `content_format: "markdown"` y un bloque de código contiene secuencias de escape de expresiones regulares (como `\d`, `\g`, `\s`) o bloques matemáticos (`$...$`), el preprocesador interno falla en `re.sub` (`bad escape \d`) y hace *fallback* silencioso a HTML crudo (`<pre class="highlight"><code>...</code></pre>`). En Confluence Cloud, eso provoca que **cada línea se renderice como una línea de código inline independiente** en lugar de un bloque de código unificado, además de romper los saltos de línea del encabezado.
> - **Solución Obligatoria**: Cuando el documento incluya expresiones regulares (`\d{5,8}`, etc.), diagramas ASCII o bloques Mermaid, usar **`content_format: "storage"`** con la macro nativa de Confluence:
> ```xml
> <ac:structured-macro ac:name="code" ac:schema-version="1">
>   <ac:parameter ac:name="language">none</ac:parameter>
>   <ac:plain-text-body><![CDATA[...código aquí...]]></ac:plain-text-body>
> </ac:structured-macro>
> ```

---

## 5. Estándar Documental OKF2 (Open Knowledge Format 2.0) y Saltos de Línea Cortos

Todo documento de especificación o arquitectura técnica debe incluir el encabezado estandarizado OKF2 en un bloque de cita con **saltos de línea cortos (`<br/> ` en un único párrafo `<p>`, sin saltos de párrafo ni `\n` después de `<br/>`)**:

* **En formato `storage` (XHTML Recomendado — 1 sola línea continua dentro de `<p>`)**:
```xml
<blockquote><p><strong>Producto / Proyecto:</strong> Miss Pedidos SaaS<br/> <strong>Repositorio:</strong> <code>jg7/miss-pedidos</code><br/> <strong>Documento:</strong> Especificación Técnica<br/> <strong>Iniciativa / Ticket:</strong> <a href="https://JG7.atlassian.net/browse/DISC-49">DISC-49</a><br/> <strong>Versión / Estado:</strong> <code>v1.0.0</code> | <code>Producción</code><br/> <strong>Estándar:</strong> <code>Google Open Knowledge Format (OKF v0.2)</code></p></blockquote>
```
*(Nunca colocar `<br/>\n` con salto de línea ni múltiples `<p>` dentro del `<blockquote>` de metadata, ya que Confluence Cloud los convierte en párrafos separados con doble espaciado).*

