---
name: confluence-roadmap-planner
description: Guía y playbook para generar, estructurar e insertar la macro nativa 'Planificador de Hoja de Ruta' (Roadmap Planner) en páginas de Confluence Cloud vía MCP jira-mcp-server (confluence_create_page, confluence_update_page) utilizando formato storage/xhtml sin fallos ni dependencias de plugins externos.
---

# Confluence Roadmap Planner Skill

Utiliza este skill cada vez que un usuario o requerimiento solicite representar **cronogramas, temporalidad, fases de proyecto, hitos o planes de lanzamiento** dentro de páginas de Confluence Cloud mediante el **Planificador de Hoja de Ruta (`Roadmap Planner`)** nativo.

---

## 1. Por qué NO usar bloques ` ```mermaid ` en Confluence Cloud

- **Problema de Plugins**: Al enviar bloques Markdown con ` ```mermaid `, el convertidor de Confluence Cloud intenta invocar una extensión del Marketplace. Si la app no está instalada, no tiene licencia activa o está deprecada, la página muestra el error fatal:
  > `⚠️ Error al cargar la extensión.`
- **Solución Oficial**: Utilizar la macro nativa de Atlassian **`Roadmap Planner` (`<ac:structured-macro ac:name="roadmap">`)** enviando el contenido en formato **`xhtml` / `storage`**.

---

## 2. Estructura y Esquema de Almacenamiento (Storage Format)

En Confluence Cloud, la macro `roadmap` almacena la definición de carriles, barras de tiempo y marcadores dentro del parámetro `<ac:parameter ac:name="source">` como un **JSON serializado y codificado en URL (`encodeURIComponent`)**.

### Esquema JSON del Payload:

```typescript
{
  "title": "Nombre de la Hoja de Ruta",
  "timeline": {
    "startDate": "2026-08-01 00:00:00", // Inicio del rango visible
    "endDate": "2026-10-31 00:00:00",   // Fin del rango visible
    "displayOption": "MONTH"            // "MONTH" o "WEEK"
  },
  "lanes": [
    {
      "title": "Hito 1: Temporada Inscripciones (P0)",
      "color": {
        "lane": "#2abb7f",
        "bar": "#2abb7f",
        "text": "#ffffff",
        "count": 1
      },
      "bars": [
        {
          "id": "bar-1",
          "title": "Alta en 3 Pasos y Recibos",
          "description": "Captura rápida y tickets WhatsApp",
          "startDate": "2026-08-15 00:00:00",
          "duration": 0.5, // Duración en meses/fracciones
          "rowIndex": 0,   // Fila dentro del carril (0, 1, 2)
          "pageLink": {}
        }
      ]
    }
  ],
  "markers": [
    {
      "title": "Kick-off Oficial",
      "markerDate": "2026-08-28 00:00:00"
    }
  ]
}
```

### Paleta de Colores Oficial de Confluence:

- **Verde Éxito / Entregado**: `{ "lane": "#2abb7f", "bar": "#2abb7f", "text": "#ffffff" }`
- **Verde Oscuro Operativo**: `{ "lane": "#1f845a", "bar": "#1f845a", "text": "#ffffff" }`
- **Azul Corporativo / Cobranza**: `{ "lane": "#0c66e4", "bar": "#0c66e4", "text": "#ffffff" }`
- **Morado / Compras y Proveedores**: `{ "lane": "#6e5dc6", "bar": "#6e5dc6", "text": "#ffffff" }`
- **Ámbar / En Progreso**: `{ "lane": "#f6c342", "bar": "#f6c342", "text": "#594300" }`
- **Gris / Backlog Planeado**: `{ "lane": "#626f86", "bar": "#626f86", "text": "#ffffff" }`

---

## 3. Plantilla XML Canónica para Confluence Storage

```xml
<ac:structured-macro ac:name="roadmap" ac:schema-version="1" data-layout="default">
  <ac:parameter ac:name="maplinks"></ac:parameter>
  <ac:parameter ac:name="timeline">true</ac:parameter>
  <ac:parameter ac:name="source">{{ENCODED_JSON_PAYLOAD}}</ac:parameter>
  <ac:parameter ac:name="pagelinks"></ac:parameter>
  <ac:parameter ac:name="title">{{ENCODED_TITLE}}</ac:parameter>
</ac:structured-macro>
```

---

## 4. Playbook de Implementación con MCP (`jira-mcp-server`)

Cuando necesites actualizar o crear una página de Confluence con un Roadmap Planner:

1. **Obtener el contenido actual** (si es actualización):
   - Invoca `confluence_get_page` con `convert_to_markdown: false` para inspeccionar el storage XHTML.
2. **Generar el Payload codificado**:
   - Utiliza el helper TypeScript `.agents/skills/confluence-roadmap-planner/scripts/generate-roadmap-macro.ts` o codifica el JSON con `encodeURIComponent(JSON.stringify(data))`.
3. **Incrustar la macro en el HTML**:
   - Coloca la macro `<ac:structured-macro ac:name="roadmap" ...>` en la ubicación deseada (ej. después del resumen ejecutivo y antes de las tablas de detalle).
4. **Enviar a Confluence vía MCP**:
   - Llama a `confluence_create_page` o `confluence_update_page` especificando:
     - `content_format: "xhtml"` (o `"storage"`).
     - `content_file`: ruta al archivo XHTML generado.
5. **Verificación**:
   - Confirma que la respuesta retorne `"message": "Page updated successfully"` con el link directo a la página.
